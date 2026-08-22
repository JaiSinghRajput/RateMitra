import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PageView from '@/models/PageView';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';

    await dbConnect();
    
    // Check if we already have a view from this IP in the last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingView = await PageView.findOne({
      organizationId,
      ipAddress,
      createdAt: { $gte: yesterday }
    });

    if (!existingView) {
      await PageView.create({
        organizationId,
        userAgent,
        ipAddress
      });
    }

    return NextResponse.json({ success: true, newView: !existingView });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
