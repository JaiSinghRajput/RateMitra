import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import PageView from '@/models/PageView';

export async function GET(req: NextRequest) {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized: No organization selected' }, { status: 401 });
    }

    await dbConnect();
    
    // Total views
    const totalViews = await PageView.countDocuments({ organizationId: orgId });

    // Views by date (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const viewsOverTime = await PageView.aggregate([
      { 
        $match: { 
          organizationId: orgId,
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format for recharts
    const chartData = viewsOverTime.map(item => ({
      date: item._id,
      views: item.views
    }));

    // If some days have 0 views, they might be missing. We could fill them in, but Recharts handles missing data if we format it correctly. 
    // To make it look perfect, let's fill in the missing days.
    const filledChartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const existing = chartData.find(c => c.date === dateStr);
      filledChartData.push({
        date: dateStr,
        views: existing ? existing.views : 0
      });
    }

    return NextResponse.json({ totalViews, viewsOverTime: filledChartData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
