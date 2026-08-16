import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import Announcement from '@/lib/models/Announcement';
import Sponsor from '@/lib/models/Sponsor';
import TeamMember from '@/lib/models/TeamMember';
import TimelineMilestone from '@/lib/models/TimelineMilestone';
import {
  EVENTS,
  ANNOUNCEMENTS,
  SPONSORS,
  TEAM_MEMBERS,
  TIMELINE,
} from '@/lib/dummy-data';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const isAuth = await verifyAdminAuth();
    if (!isAuth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection failure.' },
        { status: 500 }
      );
    }

    const stats = {
      eventsInserted: 0,
      announcementsInserted: 0,
      sponsorsInserted: 0,
      teamMembersInserted: 0,
      timelineInserted: 0,
    };

    // Seed Events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0 && EVENTS.length > 0) {
      await Event.insertMany(
        EVENTS.map((e: any) => ({
          slug: e.slug,
          name: e.name,
          hook: e.hook,
          description: e.description,
          longDescription: e.longDescription || e.description,
          iconName: e.iconName,
          prize: e.prize,
          difficulty: e.difficulty,
          category: e.category,
          isTechnical: e.isTechnical ?? true,
          type: e.type || (e.isTechnical ? 'Technical' : 'Non-Technical'),
          rules: e.rules || [],
          eligibility: e.eligibility,
          teamSize: e.teamSize,
          imageUrl: e.imageUrl,
          color: e.color,
          location: e.location,
          registrationFee: e.registrationFee,
          eventHead: e.eventHead,
          organiserContact: e.organiserContact,
          startTime: e.startTime,
          endTime: e.endTime,
        }))
      );
      stats.eventsInserted = EVENTS.length;
    }

    // Seed Announcements
    const announcementCount = await Announcement.countDocuments();
    if (announcementCount === 0 && ANNOUNCEMENTS.length > 0) {
      await Announcement.insertMany(
        ANNOUNCEMENTS.map((a: any) => ({
          title: a.title,
          content: a.content,
          timestamp: a.timestamp || a.createdAt || new Date().toISOString(),
          author: a.author || 'Organizing Committee',
        }))
      );
      stats.announcementsInserted = ANNOUNCEMENTS.length;
    }

    // Seed Sponsors
    const sponsorCount = await Sponsor.countDocuments();
    if (sponsorCount === 0 && SPONSORS.length > 0) {
      await Sponsor.insertMany(
        SPONSORS.map((s: any, idx: number) => ({
          name: s.name,
          category: s.category || s.tier || 'Partner',
          logoUrl: s.logoUrl,
          websiteUrl: s.websiteUrl,
          order: s.order ?? idx,
        }))
      );
      stats.sponsorsInserted = SPONSORS.length;
    }

    // Seed Team Members
    const teamCount = await TeamMember.countDocuments();
    if (teamCount === 0 && TEAM_MEMBERS.length > 0) {
      await TeamMember.insertMany(
        TEAM_MEMBERS.map((tm: any, idx: number) => ({
          name: tm.name,
          role: tm.role,
          group: tm.group || tm.category || 'Organiser',
          photoUrl: tm.photoUrl || tm.profileImageUrl,
          linkedinUrl: tm.linkedinUrl,
          order: tm.order ?? tm.displayOrder ?? idx,
        }))
      );
      stats.teamMembersInserted = TEAM_MEMBERS.length;
    }

    // Seed Timeline Milestones
    const timelineCount = await TimelineMilestone.countDocuments();
    if (timelineCount === 0 && TIMELINE.length > 0) {
      await TimelineMilestone.insertMany(
        TIMELINE.map((tm: any, idx: number) => ({
          date: tm.date,
          title: tm.title,
          description: tm.description,
          status: (['Completed', 'Live', 'Upcoming'].includes(tm.status) ? tm.status : 'Upcoming'),
          order: tm.order ?? idx,
        }))
      );
      stats.timelineInserted = TIMELINE.length;
    }

    return NextResponse.json({
      success: true,
      message: 'MongoDB database seed operation completed.',
      stats,
    });
  } catch (err: any) {
    console.error('[POST /api/admin/seed] Error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Database seed failed' },
      { status: 500 }
    );
  }
}
