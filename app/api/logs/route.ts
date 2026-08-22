import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import ActionLog from '@/models/ActionLog';

export async function GET(req: NextRequest) {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized: No organization selected' }, { status: 401 });
    }

    await dbConnect();
    const logs = await ActionLog.find({ organizationId: orgId })
      .sort({ createdAt: -1 })
      .limit(50); // Get latest 50 logs

    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
