import Product, { IProduct } from '../models/Product';

export const productsService = {
    getAll: async (): Promise<IProduct[]> => {
        try {
            const products = await Product.find({});
            return products || [];
        } catch (error) {
            console.error('Error fetching products:', error);
            return []; // Fail safe: return empty array instead of throwing if critical
        }
    },

    getById: async (id: string): Promise<IProduct | null> => {
        try {
            return await Product.findOne({ id: id });
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            throw error;
        }
    },

    getBySlug: async (slug: string): Promise<IProduct | null> => {
        try {
            return await Product.findOne({ slug: slug });
        } catch (error) {
            console.error('Error fetching product by slug:', error);
            throw error;
        }
    },

    getByCategory: async (categorySlug: string): Promise<IProduct[]> => {
        try {
            const products = await Product.find({ categories: categorySlug });
            return products || [];
        } catch (error) {
            console.error('Error fetching products by category:', error);
            return [];
        }
    },

    create: async (productData: any): Promise<IProduct> => {
        try {
            // Unique checks are handled by Mongoose schema (unique: true)
            // But we can catch duplicate key errors if needed
            const newProduct = new Product(productData);
            return await newProduct.save();
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    createBulk: async (productsData: any[]): Promise<IProduct[]> => {
        try {
            // Sanitize: remove system fields if present
            const cleanData = productsData.map(p => {
                const { _id, createdAt, updatedAt, __v, ...rest } = p;
                return rest;
            });
            return await Product.insertMany(cleanData);
        } catch (error) {
            console.error('Error creating bulk products:', error);
            throw error;
        }
    },

    update: async (id: string, updates: Partial<IProduct>): Promise<IProduct | null> => {
        try {
            return await Product.findOneAndUpdate(
                { id: id },
                updates,
                { new: true } // Return the updated document
            );
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    delete: async (id: string): Promise<boolean> => {
        try {
            const result = await Product.findOneAndDelete({ id: id });
            return !!result;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
};
