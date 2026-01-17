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
    customer?: {
        name: string;
        email: string;
        phone: string;
        document: string;
    };
    items?: Array<{
        title: string;
        quantity: number;
        unitPrice: number;
        tangible: boolean;
    }>;
    totalAmount?: number;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
    paymentId: { type: String, required: true, unique: true, index: true },
    status: { type: String, required: true, default: 'waiting_payment' },
    totalAmount: { type: Number },
    customer: {
        name: String,
        email: String,
        phone: String,
        document: String
    },
    items: [{
        title: String,
        quantity: Number,
        unitPrice: Number,
        tangible: Boolean
    }],
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
