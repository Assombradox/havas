import type { Product } from '../../types/Product';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/products`;

console.log('🔌 Products Service initialized with API:', API_URL);

export const productsService = {
    getAll: async (): Promise<Product[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) {
            throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
        }
        return res.json();
    },

    getBySlug: async (slug: string): Promise<Product | undefined> => {
        const res = await fetch(`${API_URL}/${slug}`);
        if (res.status === 404) return undefined;
        if (!res.ok) {
            throw new Error(`Failed to fetch product ${slug}: ${res.status} ${res.statusText}`);
        }
        return res.json();
    }
};
