import mongoose, { Schema, Document } from 'mongoose';

export interface Card extends Document {
    cardNumber: string;
    companyId: mongoose.Types.ObjectId; // Reference to Company
    expirationDate: string;
    creditLimit: number;
    isActivated: boolean;
}

const cardSchema: Schema = new Schema({
    cardNumber: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    expirationDate: { type: Date, required: true },
    creditLimit: { type: Number, required: true },
    isActivated: { type: Boolean, required: true },
});

export default mongoose.model<Card>('card', cardSchema);