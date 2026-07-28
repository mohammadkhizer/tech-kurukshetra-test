import mongoose, { Schema, Document } from 'mongoose';

export interface ITimelineMilestone extends Document {
  id?: string;
  date: string;
  title: string;
  description: string;
  status: 'Completed' | 'Live' | 'Upcoming';
  order?: number;
}

const TimelineMilestoneSchema: Schema = new Schema(
  {
    date: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Completed', 'Live', 'Upcoming'], default: 'Upcoming' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

TimelineMilestoneSchema.virtual('id').get(function (this: any) {
  return this._id ? this._id.toString() : '';
});

export default mongoose.models.TimelineMilestone ||
  mongoose.model<ITimelineMilestone>('TimelineMilestone', TimelineMilestoneSchema);
