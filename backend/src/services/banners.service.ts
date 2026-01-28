import Banner, { IBanner, BannerLocation } from '../models/Banner';

export const bannersService = {
    getAll: async (): Promise<IBanner[]> => {
        return await Banner.find({}).sort({ location: 1, order: 1 });
    },

    getPublic: async (location: string): Promise<IBanner[]> => {
        // Validation handled implicitly or by controller
        return await Banner.find({ location, active: true }).sort({ order: 1 });
    },

    create: async (data: Partial<IBanner>): Promise<IBanner> => {
        // Generate simple ID if not present (although controller usually handles or we do here)
        const id = Date.now().toString(36);
        const banner = new Banner({ ...data, id });
        return await banner.save();
    },

    update: async (id: string, updates: Partial<IBanner>): Promise<IBanner | null> => {
        return await Banner.findOneAndUpdate({ id }, updates, { new: true });
    },

    delete: async (id: string): Promise<boolean> => {
        const result = await Banner.findOneAndDelete({ id });
        return !!result;
    }
};
