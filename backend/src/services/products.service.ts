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
