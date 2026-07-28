import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
  id?: string;
  name: string;
  role: string;
  group?: string;
  linkedinUrl?: string;
  photoUrl?: string;
  order?: number;
}

const TeamMemberSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    group: { type: String, default: 'Volunteers' },
    linkedinUrl: { type: String },
    photoUrl: { type: String },
    order: { type: Number, default: 99 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

TeamMemberSchema.virtual('id').get(function (this: any) {
  return this._id ? this._id.toString() : '';
});

export default mongoose.models.TeamMember ||
  mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
