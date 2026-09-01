import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  id?: string;
  orderId: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  mode?: 'individual' | 'team';
  teamName?: string;
  teamSize?: string;
  eventSlug?: string;
  paymentStatus?: string;
  rawPayload?: Schema.Types.Mixed;
}

const RegistrationSchema: Schema = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String },
    college: { type: String, index: true },
    mode: { type: String, enum: ['individual', 'team'], default: 'individual' },
    teamName: { type: String },
    teamSize: { type: String },
    eventSlug: { type: String, index: true },
    paymentStatus: { type: String, default: 'completed' },
    rawPayload: { type: Schema.Types.Mixed },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

RegistrationSchema.index({ email: 1, eventSlug: 1 });
RegistrationSchema.index({ createdAt: -1 });

RegistrationSchema.virtual('id').get(function (this: any) {
  return this._id ? this._id.toString() : '';
});

export default mongoose.models.Registration ||
  mongoose.model<IRegistration>('Registration', RegistrationSchema);
