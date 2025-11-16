import mongoose, { Schema, Document } from 'mongoose';

export interface Invoice extends Document {
  companyId: mongoose.Types.ObjectId;
  cardId: mongoose.Types.ObjectId;
  isPaid: boolean;
  amount: number;
  createdAt: Date;
  dueDate: Date;
}

const invoiceSchema: Schema = new Schema({
  companyId: { type: mongoose.Types.ObjectId, required: true },
  cardId: { type: mongoose.Types.ObjectId, required: true },
  isPaid: { type: Boolean, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  dueDate: { type: Date, required: true },
});

export default mongoose.model<Invoice>('Invoice', invoiceSchema);
