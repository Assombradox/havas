import mongoose, { Document, Schema } from 'mongoose';

export interface IStoreConfig extends Document {
    logoUrl: string;
    primaryColor: string;
    storeName: string;
    updatedAt: Date;
}

const StoreConfigSchema: Schema = new Schema({
    logoUrl: { type: String, required: false },
    primaryColor: { type: String, default: '#000000' },
    storeName: { type: String, default: 'Havas Store' }
}, {
    timestamps: true
});

// Access the singleton config
export const StoreConfig = mongoose.model<IStoreConfig>('StoreConfig', StoreConfigSchema);

export const getStoreConfig = async () => {
    let config = await StoreConfig.findOne();
    if (!config) {
        config = await StoreConfig.create({});
    }
    return config;
};
