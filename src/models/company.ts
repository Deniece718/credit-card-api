import mongoose, { Schema, Document } from 'mongoose';

export interface Company extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
}

const companySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
});

export default mongoose.model<Company>('Company', companySchema);
