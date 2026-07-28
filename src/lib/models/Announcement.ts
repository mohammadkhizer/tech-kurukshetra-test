import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  id?: string;
  title: string;
  content: string;
  timestamp: string;
  author?: string;
}

const AnnouncementSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: String, required: true },
    author: { type: String, default: 'Organizing Committee' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

AnnouncementSchema.virtual('id').get(function (this: any) {
  return this._id ? this._id.toString() : '';
});

export default mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
