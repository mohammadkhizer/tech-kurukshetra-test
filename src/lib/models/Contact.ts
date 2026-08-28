import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema(
  {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    status:  { type: String, default: 'new' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ContactSchema.virtual('id').get(function (this: any) {
  return this._id ? this._id.toString() : '';
});

export default mongoose.models.Contact ||
  mongoose.model<IContact>('Contact', ContactSchema);
