import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  name: string;
  email: string;
  phone?: string;
  eventsAttended: string[];
  rating: number;
  likedMost?: string;
  improvements: string;
  wouldRecommend: 'Yes' | 'No' | 'Maybe';
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, index: true },
    phone: { type: String, trim: true, default: '' },
    eventsAttended: { type: [String], required: true, default: [] },
    rating: { type: Number, required: true, min: 1, max: 5 },
    likedMost: { type: String, trim: true, default: '' },
    improvements: { type: String, required: true, trim: true },
    wouldRecommend: {
      type: String,
      required: true,
      enum: ['Yes', 'No', 'Maybe'],
      default: 'Yes',
    },
    status: { type: String, default: 'new' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

FeedbackSchema.index({ createdAt: -1 });

FeedbackSchema.virtual('id').get(function (this: any) {
  return this._id ? this._id.toString() : '';
});

export default mongoose.models.Feedback ||
  mongoose.model<IFeedback>('Feedback', FeedbackSchema);
