import mongoose, { Schema, Document } from 'mongoose';

export interface ISponsor extends Document {
  id?: string;
  name: string;
  category?: string;
  logoUrl?: string;
  websiteUrl?: string;
  order?: number;
}

const SponsorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'Partner' },
    logoUrl: { type: String },
    websiteUrl: { type: String },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

SponsorSchema.virtual('id').get(function (this: any) {
  return this._id ? this._id.toString() : '';
});

export default mongoose.models.Sponsor ||
  mongoose.model<ISponsor>('Sponsor', SponsorSchema);
