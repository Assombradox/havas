import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    id: string;
    name: string;
    slug: string;
    image: string;
    title?: string;
    description?: string;
    order?: number;
    type: 'category' | 'collection';
}

const CategorySchema: Schema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    order: { type: Number },
    type: { type: String, enum: ['category', 'collection'], required: true, default: 'category' }
}, {
    timestamps: true
});

export default mongoose.model<ICategory>('Category', CategorySchema);
