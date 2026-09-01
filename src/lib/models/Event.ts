import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  id?: string;
  slug: string;
  name: string;
  hook?: string;
  description: string;
  longDescription?: string;
  iconName?: string;
  prize?: string;
  prizePool?: string;
  difficulty?: string;
  category?: 'TECH' | 'NONTECH' | string;
  isTechnical?: boolean;
  type?: 'solo' | 'team' | string;
  teamSize?: Schema.Types.Mixed;
  rules?: string[];
  eligibility?: string;
  duration?: string;
  venue?: string;
  location?: string;
  date?: string;
  time?: string;
  registrationDeadline?: string;
  entryFee?: Schema.Types.Mixed;
  registrationFee?: string;
  coordinatorContact?: Schema.Types.Mixed;
  bannerImage?: string;
  imageUrl?: string;
  imgId?: string;
  color?: string;
  eventHead?: string;
  organiserContact?: string;
  festivalDayId?: string;
  startTime?: string;
  endTime?: string;
  sponsorLogo?: string;
  sponsorName?: string;
}

const EventSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    hook: { type: String, default: '' },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    iconName: { type: String, default: 'Code2' },
    prize: { type: String, default: 'TBA' },
    prizePool: { type: String, default: 'TBA' },
    difficulty: { type: String, default: 'Intermediate' },
    category: { type: String, default: 'TECH', index: true },
    isTechnical: { type: Boolean, default: true, index: true },
    type: { type: String, default: 'team' },
    teamSize: { type: Schema.Types.Mixed, default: { min: 1, max: 1 } },
    rules: [{ type: String }],
    eligibility: { type: String, default: 'Open to all students' },
    duration: { type: String, default: '24h' },
    venue: { type: String, default: '' },
    location: { type: String, default: '' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    registrationDeadline: { type: String, default: '' },
    entryFee: { type: Schema.Types.Mixed, default: 'Free' },
    registrationFee: { type: String, default: 'Free' },
    coordinatorContact: { type: Schema.Types.Mixed, default: { name: '', phone: '', email: '' } },
    bannerImage: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    imgId: { type: String, default: '' },
    color: { type: String, default: '' },
    eventHead: { type: String, default: '' },
    organiserContact: { type: String, default: '' },
    festivalDayId: { type: String, default: '' },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    sponsorLogo: { type: String, default: '' },
    sponsorName: { type: String, default: '' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

EventSchema.virtual('id').get(function (this: any) {
  return this._id ? this._id.toString() : this.slug;
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
