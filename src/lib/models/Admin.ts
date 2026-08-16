import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  id?: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'superadmin' | 'admin';
  status: 'approved' | 'pending';
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
    status: { type: String, enum: ['approved', 'pending'], default: 'approved' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

AdminSchema.virtual('id').get(function (this: any) {
  return this._id ? this._id.toString() : '';
});

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
