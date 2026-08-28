import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';
import Event from '@/lib/models/Event';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: true, data: null });
    }

    const [dbRegsCount, uniqueColleges, events] = await Promise.all([
      Registration.countDocuments(),
      Registration.distinct('college'),
      Event.find({}).lean(),
    ]);

    // If no real data exists in database yet, return data: null to hide stats section
    if (dbRegsCount === 0 && events.length === 0) {
      return NextResponse.json({ success: true, data: null });
    }

    // Calculate total prize pool from event records
    let totalPrizePool = 0;
    events.forEach((evt: any) => {
      if (evt.prize) {
        const numeric = parseInt(evt.prize.replace(/[^\d]/g, ''), 10);
        if (!isNaN(numeric)) {
          totalPrizePool += numeric;
        }
      }
    });

    const items = [];

    if (totalPrizePool > 0) {
      items.push({
        id: 'prize-pool',
        label: 'TOTAL PRIZE POOL',
        targetValue: totalPrizePool,
        prefix: '₹',
        suffix: '+',
        displayValue: `₹${totalPrizePool.toLocaleString()}+`,
        iconName: 'Trophy',
      });
    }

    if (dbRegsCount > 0) {
      items.push({
        id: 'warriors',
        label: 'WARRIORS REGISTERED',
        targetValue: dbRegsCount,
        prefix: '',
        suffix: '+',
        displayValue: `${dbRegsCount.toLocaleString()}+`,
        iconName: 'Users',
      });
    }

    if (events.length > 0) {
      items.push({
        id: 'arenas',
        label: 'BATTLE ARENAS',
        targetValue: events.length,
        prefix: '',
        suffix: ' Arenas',
        displayValue: `${events.length} Arenas`,
        iconName: 'Swords',
      });
    }

    if (uniqueColleges && uniqueColleges.length > 0) {
      items.push({
        id: 'colleges',
        label: 'PARTNER INSTITUTIONS',
        targetValue: uniqueColleges.length,
        prefix: '',
        suffix: '+',
        displayValue: `${uniqueColleges.length}+`,
        iconName: 'Building2',
      });
    }

    if (items.length === 0) {
      return NextResponse.json({ success: true, data: null });
    }

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (err: any) {
    console.error('[GET /api/stats] Error:', err);
    return NextResponse.json({ success: false, data: null }, { status: 500 });
  }
}
