import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    id: string;
    name: string;
    slug: string;
    image: string;
    type: 'category' | 'collection';
}

const CategorySchema: Schema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    type: { type: String, enum: ['category', 'collection'], required: true }
}, {
    timestamps: true
});

export default mongoose.model<ICategory>('Category', CategorySchema);
