import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
    paymentId: string;
    shortId?: number;
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
    shortId: { type: Number, unique: true, sparse: true },
    status: { type: String, required: true, default: 'waiting_payment' },
    totalAmount: { type: Number },
    customer: {
        name: String,
        email: String,
        phone: String,
        document: String
    },
    shippingAddress: {
        street: String,
        number: String,
        neighborhood: String,
        city: String,
        state: String,
        zipCode: String,
        complement: String
    },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String, // Snapshot Name
        title: String, // Legacy fallback
        quantity: Number,
        price: Schema.Types.Mixed, // Can be Number or String "R$..."
        unitPrice: Number, // Legacy
        image: String,
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
    timestamps: true,
    strict: false // Allow flexibility for now
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
