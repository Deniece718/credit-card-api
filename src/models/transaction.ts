import mongoose, { Document, Schema } from 'mongoose';

export interface Transaction extends Document {
    cardId: mongoose.Types.ObjectId;
    description: string;
    amount: number;
    date: Date;
}

const TransactionSchema: Schema = new Schema({
    cardId: {type: mongoose.Types.ObjectId, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true }
})

export default mongoose.model<Transaction>('Transaction', TransactionSchema);
