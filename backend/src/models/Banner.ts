import mongoose, { Schema, Document } from 'mongoose';

export enum BannerLocation {
    HERO = 'HERO',
    EDITORIAL = 'EDITORIAL'
}

export interface IBanner extends Document {
    id: string; // Public ID
    title: string;
    imageUrl: string;
    link?: string;
    active: boolean;
    order: number;
    location: BannerLocation;
}

const BannerSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    link: { type: String },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    location: { type: String, enum: Object.values(BannerLocation), required: true }
}, {
    timestamps: true
});

export default mongoose.model<IBanner>('Banner', BannerSchema);
