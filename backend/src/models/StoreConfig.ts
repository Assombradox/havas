import mongoose, { Document, Schema } from 'mongoose';

export interface IStoreConfig extends Document {
    logoUrl: string;
    primaryColor: string;
    storeName: string;
    emailTitle?: string;
    emailMessage?: string;
    emailFooter?: string;
    utmifyToken?: string;
    utmifyActive?: boolean;
    updatedAt: Date;
}

const StoreConfigSchema: Schema = new Schema({
    logoUrl: { type: String, required: false },
    primaryColor: { type: String, default: '#000000' },
    storeName: { type: String, default: 'Havas Store' },
    emailTitle: { type: String, default: 'Pedido Recebido!' },
    emailMessage: { type: String, default: 'Olá {name}, recebemos seu pedido **#{orderId}**.' },
    emailFooter: { type: String, default: 'Se tiver dúvidas, responda a este email.' },
    utmifyToken: { type: String },
    utmifyActive: { type: Boolean, default: false }
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
