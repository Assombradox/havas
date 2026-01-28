import Product, { IProduct } from '../models/Product';
import axios from 'axios';
import * as cheerio from 'cheerio';

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
            const products = await Product.find({ categories: categorySlug }).sort({ order: 1 });
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
    },

    duplicate: async (id: string): Promise<IProduct> => {
        try {
            const original = await Product.findOne({ id });
            if (!original) throw new Error('Product not found');

            const originalObj = original.toObject() as any;

            // Generate new IDs
            const newId = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 5);
            const randomSuffix = Math.random().toString(36).substring(2, 6);

            // Create new base slug
            const newSlug = `${originalObj.slug}-copy-${randomSuffix}`;

            // Prepare new object
            const { _id, created_at, updated_at, ...rest } = originalObj;

            const newProductData = {
                ...rest,
                id: newId,
                name: `${originalObj.name} (Cópia)`,
                slug: newSlug,
                // Ensure unique IDs for sub-documents if necessary (e.g. colors)
                // Assuming simple structure for now, but strictly speaking we should regenerate IDs for colors if they have them.
                // Based on previous code, colors have 'id'. Let's regen them.
                colors: originalObj.colors ? originalObj.colors.map((c: any) => ({
                    ...c,
                    id: Date.now().toString() + Math.random().toString().slice(2, 5) // Simple unique gen 
                })) : []
            };

            const newProduct = new Product(newProductData);
            return await newProduct.save();

        } catch (error) {
            console.error('Error duplicating product:', error);
            throw error;
        }
    },



    batchReorder: async (items: { id: string, order: number }[]): Promise<boolean> => {
        try {
            const operations = items.map(item => ({
                updateOne: {
                    filter: { id: item.id },
                    update: { $set: { order: item.order } }
                }
            }));
            await Product.bulkWrite(operations);
            return true;
        } catch (error) {
            console.error('Error in batch reorder:', error);
            throw error;
        }
    },

    extractMetadata: async (url: string): Promise<any> => {
        try {
            console.log(`Extracting metadata from: ${url}`);

            // 1. Fetch HTML
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            // 2. Parse HTML
            const $ = cheerio.load(data);

            // 3. Extract Metadata
            const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
            const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
            const image = $('meta[property="og:image"]').attr('content') || '';

            // 4. Extract Price (Try meta tags first, then regex)
            let priceRaw = $('meta[property="product:price:amount"]').attr('content') ||
                $('meta[property="og:price:amount"]').attr('content');

            if (!priceRaw) {
                // Fallback: simple currency regex search in body
                const priceMatch = $('body').text().match(/R\$\s?(\d{1,3}(?:\.\d{3})*,\d{2})/);
                if (priceMatch && priceMatch[1]) {
                    priceRaw = priceMatch[1].replace('.', '').replace(',', '.');
                }
            }

            const originalPrice = priceRaw ? parseFloat(priceRaw) : 0;

            // 5. Apply Magic Math
            // Discount: 40% to 60%
            const discountFactor = 0.40 + (Math.random() * 0.20);
            const price = originalPrice > 0 ? Number((originalPrice * (1 - discountFactor)).toFixed(2)) : 0;

            // Rating: 4.7 to 5.0
            const rating = Number((4.7 + (Math.random() * 0.3)).toFixed(1));

            // Reviews: 31 to 851
            const reviewCount = Math.floor(31 + (Math.random() * 820));

            return {
                name: title,
                description: description,
                price: price, // Discounted
                originalPrice: originalPrice, // Real from site
                images: image ? [image] : [],
                rating: rating,
                reviews: reviewCount,
                features: []
            };
        } catch (error) {
            console.error('Error extracting metadata:', error);
            throw new Error('Failed to extract data from URL');
        }
    }
};
