import Category, { ICategory } from '../models/Category';

export const categoriesService = {
    getAll: async (): Promise<ICategory[]> => {
        try {
            return await Category.find({}).sort({ order: 1 }); // Preserving order logic
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    getBySlug: async (slug: string): Promise<ICategory | null> => {
        try {
            return await Category.findOne({ slug: slug });
        } catch (error) {
            console.error('Error fetching category by slug:', error);
            throw error;
        }
    },

    create: async (categoryData: any): Promise<ICategory> => {
        try {
            const newCategory = new Category(categoryData);
            return await newCategory.save();
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    update: async (slug: string, updates: Partial<ICategory>): Promise<ICategory | null> => {
        try {
            return await Category.findOneAndUpdate(
                { slug: slug },
                updates,
                { new: true }
            );
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }
};
