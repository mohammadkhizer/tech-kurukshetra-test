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
  difficulty?: string;
  category?: string;
  isTechnical?: boolean;
  type?: string;
  rules?: string[];
  eligibility?: string;
  teamSize?: string;
  imageUrl?: string;
  imgId?: string;
  color?: string;
  location?: string;
  registrationFee?: string;
  eventHead?: string;
  organiserContact?: string;
  festivalDayId?: string;
  startTime?: string;
  endTime?: string;
}

const EventSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    hook: { type: String },
    description: { type: String, required: true },
    longDescription: { type: String },
    iconName: { type: String },
    prize: { type: String },
    difficulty: { type: String },
    category: { type: String },
    isTechnical: { type: Boolean, default: true },
    type: { type: String },
    rules: [{ type: String }],
    eligibility: { type: String },
    teamSize: { type: String },
    imageUrl: { type: String },
    imgId: { type: String },
    color: { type: String },
    location: { type: String },
    registrationFee: { type: String },
    eventHead: { type: String },
    organiserContact: { type: String },
    festivalDayId: { type: String },
    startTime: { type: String },
    endTime: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

EventSchema.virtual('id').get(function (this: any) {
  return this._id ? this._id.toString() : '';
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
