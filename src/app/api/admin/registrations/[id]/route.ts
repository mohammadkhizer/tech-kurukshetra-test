import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Registration ID or Order ID is required' },
        { status: 400 }
      );
    }

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Build query to match either MongoDB _id or orderId
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { orderId: id }] } : { orderId: id };

    const deletedRecord = await Registration.findOneAndDelete(query);

    // Also forward delete action to Google Apps Script if URL is configured
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'delete_registration',
            payload: { orderId: id },
          }),
        });
      } catch (e) {
        console.warn('[DELETE /api/admin/registrations/[id]] Google Script notification failed:', e);
      }
    }

    if (!deletedRecord) {
      // If deleted from Google Sheets or already removed from MongoDB
      return NextResponse.json({
        success: true,
        message: 'Record processed for deletion',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Registration deleted successfully',
      id,
    });
  } catch (error: any) {
    console.error('[DELETE /api/admin/registrations/[id]] Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { orderId: id }] } : { orderId: id };

    const updatedRecord = await Registration.findOneAndUpdate(query, body, {
      new: true,
    });

    // Forward update to Google Script if configured
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'update_registration',
            payload: { orderId: id, ...body },
          }),
        });
      } catch (e) {
        console.warn('[PUT /api/admin/registrations/[id]] Google Script notification failed:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Registration updated successfully',
      data: updatedRecord,
    });
  } catch (error: any) {
    console.error('[PUT /api/admin/registrations/[id]] Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
