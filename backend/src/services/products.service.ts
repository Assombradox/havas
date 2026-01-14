import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(__dirname, '../../data/products.json');
const SRC_BACKUP = path.join(__dirname, '../../../../src/data/products.json');

// Interface (could be shared, but redundant definition here to keep backend independent)
interface Product {
    id: string;
    slug: string;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    categories: string[];
    colors: any[];
    sizes: any[];
    color?: string;
    relatedProducts?: string[];
}

export const productsService = {
    getAll: (): Product[] => {
        try {
            if (!fs.existsSync(DATA_FILE)) {
                // If file doesn't exist, try to seed
                if (fs.existsSync(SRC_BACKUP)) {
                    console.log('Seeding products from src/data...');
                    const seedData = fs.readFileSync(SRC_BACKUP, 'utf-8');
                    // Create directory if not exists
                    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
                    fs.writeFileSync(DATA_FILE, seedData);
                    return JSON.parse(seedData);
                }
                return [];
            }

            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            const products = JSON.parse(data);

            // If empty array, try reseeding (Safety check for accidental wipes)
            if (Array.isArray(products) && products.length === 0) {
                if (fs.existsSync(SRC_BACKUP)) {
                    console.log('Re-seeding empty products file...');
                    const seedData = fs.readFileSync(SRC_BACKUP, 'utf-8');
                    fs.writeFileSync(DATA_FILE, seedData);
                    return JSON.parse(seedData);
                }
            }

            return products;
        } catch (error) {
            console.error('Error reading products:', error);
            return [];
        }
    },

    getById: (id: string): Product | undefined => {
        const products = productsService.getAll();
        return products.find(p => p.id === id);
    },

    getBySlug: (slug: string): Product | undefined => {
        const products = productsService.getAll();
        return products.find(p => p.slug === slug);
    },

    create: (product: Product): Product => {
        const products = productsService.getAll();

        // Validate Slug Uniqueness
        if (products.some(p => p.slug === product.slug)) {
            throw new Error(`Slug "${product.slug}" already exists.`);
        }

        // Validate ID Uniqueness
        if (products.some(p => p.id === product.id)) {
            throw new Error(`ID "${product.id}" already exists.`);
        }

        products.push(product);
        fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 4));
        return product;
    },

    update: (id: string, updates: Partial<Product>): Product | undefined => {
        const products = productsService.getAll();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) return undefined; // Not found

        // Check Slug Uniqueness if updating slug
        if (updates.slug && updates.slug !== products[index].slug) {
            if (products.some(p => p.slug === updates.slug)) {
                throw new Error(`Slug "${updates.slug}" already exists.`);
            }
        }

        const updatedProduct = { ...products[index], ...updates };
        products[index] = updatedProduct;

        fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 4));
        return updatedProduct;
    }
};
