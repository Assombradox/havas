import mongoose, { Schema, Document } from 'mongoose';

export interface IProductColor {
    name: string;
    thumbnail: string;
    images: string[];
}

export interface IProductSize {
    label: string;
    available: boolean;
}

export interface IProduct extends Document {
    id: string; // Keep string ID for compatibility
    slug: string;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    colors: IProductColor[];
    sizes: IProductSize[];
    rating: number;
    reviewCount: number;
    isNewRelease: boolean;
    categories: string[]; // Array of slugs
    relatedProducts?: string[]; // Array of slugs
}

const ProductSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    description: { type: String },
    categories: [{ type: String }], // Array of slugs
    colors: [{
        name: { type: String, required: true },
        thumbnail: { type: String },
        images: [{ type: String }]
    }],
    sizes: [{
        label: { type: String, required: true },
        available: { type: Boolean, required: true }
    }],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isNewRelease: { type: Boolean, default: false },
    relatedProducts: [{ type: String }] // Store slugs
}, {
    timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);
