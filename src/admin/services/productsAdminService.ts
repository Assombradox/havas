import type { Product } from '../../types/Product';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/products`;

export const productsAdminService = {
    getAll: async (): Promise<Product[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },

    getById: async (slugOrId: string): Promise<Product | undefined> => {
        // Try fetching by slug first (or implement separate endpoints if needed)
        // For now, we will fetch all and find, or use the single endpoint if it matches ID/Slug logic.
        // The backend supports /products/:slug. Let's try that.
        // Note: The backend route is /:slug, but it searches by slug. 
        // If we want ID support, we should handle that. 
        // But the prompt asked for "getById" in frontend.
        // Let's rely on getAll() for now to keep it simple or hit the endpoint if we trust it.
        // Actually, let's use the list for safety as the backend :slug might strictly look for slug.

        const response = await fetch(`${API_URL}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products: Product[] = await response.json();
        return products.find(p => p.id === slugOrId || p.slug === slugOrId);
    },

    save: async (product: Product): Promise<void> => {
        // Check if exists to decide POST or PUT
        // In a real app we might have a cleaner way, but here:
        const all = await productsAdminService.getAll();
        const exists = all.find(p => p.id === product.id);

        if (exists) {
            const response = await fetch(`${API_URL}/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (!response.ok) throw new Error('Failed to update product');
        } else {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (!response.ok) throw new Error('Failed to create product');
        }
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete product');
    },

    extractMetadata: async (url: string): Promise<Partial<Product>> => {
        const response = await fetch(`${API_URL}/extract-metadata`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        if (!response.ok) throw new Error('Failed to extract metadata');
        return response.json();
    }
};

