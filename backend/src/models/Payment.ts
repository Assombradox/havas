import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
    paymentId: string;
    status: string;
    pixData: {
        paymentId: string;
        qrCodeImage: string;
        pixCode: string;
        expiresAt: string;
        amount?: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
    paymentId: { type: String, required: true, unique: true, index: true },
    status: { type: String, required: true, default: 'waiting_payment' },
    pixData: {
        paymentId: { type: String },
        qrCodeImage: { type: String },
        pixCode: { type: String },
        expiresAt: { type: String },
        amount: { type: Number }
    }
}, {
    timestamps: true
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
