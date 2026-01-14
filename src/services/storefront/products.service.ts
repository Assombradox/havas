import { products as localProducts, imageMap } from '../../data/products';
import type { Product } from '../../types/Product';

const API_URL = 'http://localhost:3000/products';

const hydrate = (product: any): Product => {
    return {
        ...product,
        colors: product.colors.map((c: any) => ({
            ...c,
            thumbnail: imageMap[c.thumbnail] || c.thumbnail,
            images: c.images.map((img: string) => imageMap[img] || img)
        }))
    };
};

export const productsService = {
    getAll: async (): Promise<Product[]> => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();
            return data.map(hydrate);
        } catch (error) {
            console.warn('API unavailable, using fallback:', error);
            return localProducts;
        }
    },
    getBySlug: async (slug: string): Promise<Product | undefined> => {
        try {
            const res = await fetch(`${API_URL}/${slug}`);
            if (res.status === 404) return undefined;
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();
            return hydrate(data);
        } catch (error) {
            console.warn('API unavailable, using fallback:', error);
            return localProducts.find(p => p.slug === slug);
        }
    }
};
