import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import OrgSettings from '@/models/OrgSettings';

export async function GET(req: NextRequest) {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized: No organization selected' }, { status: 401 });
    }

    await dbConnect();
    let settings: any = await OrgSettings.findOne({ organizationId: orgId });
    
    if (!settings) {
      // Return defaults if none exist
      settings = { primaryColor: '#1264E8', backgroundColor: '#F8FAFC', fontColor: '#172033', cardBackgroundColor: 'rgba(255, 255, 255, 1)' };
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized: No organization selected' }, { status: 401 });
    }

    const body = await req.json();
    const { primaryColor, backgroundColor, backgroundImage, fontColor, cardBackgroundColor, customSlug } = body;

    await dbConnect();
    
    if (customSlug) {
      if (!/^[a-zA-Z0-9-]+$/.test(customSlug)) {
        return NextResponse.json({ error: 'Slug can only contain letters, numbers, and dashes' }, { status: 400 });
      }
      
      try {
        const clerk = await clerkClient();
        await clerk.organizations.updateOrganization(orgId, { slug: customSlug });
      } catch (error: any) {
        console.error("Clerk update error:", error);
        const errorMessage = error.errors?.[0]?.longMessage || error.errors?.[0]?.message || 'Failed to update organization slug.';
        return NextResponse.json({ error: errorMessage }, { status: 400 });
      }
    }

    const updateData = { 
      primaryColor, 
      backgroundColor, 
      backgroundImage, 
      fontColor, 
      cardBackgroundColor
    };

    const settings = await OrgSettings.findOneAndUpdate(
      { organizationId: orgId },
      { $set: updateData, $unset: { customSlug: 1 } },
      { new: true, upsert: true } // Create if doesn't exist
    );

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
