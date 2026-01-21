import type { CategoryConfig } from '../../types/Category';

const API_URL = `${(import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')}/categories`;

console.log('🔌 Categories Service initialized with API:', API_URL);

export const categoriesService = {
    getAll: async (): Promise<CategoryConfig[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) {
            throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
        }
        return res.json();
    },

    getBySlug: async (slug: string): Promise<CategoryConfig | undefined> => {
        // Since backend might not have specific get endpoint, and frontend often needs list
        // Strategy: Try direct fetch if endpoint exists, or fetch all and find. 
        // Based on previous code, we'll try to fetch all and find, but ideally we should update backend for direct fetch.
        // For now, let's keep the logic consistent with purely consuming the getAll endpoint if no specific endpoint is guaranteed.
        // However, user prompt implies "Backend is operational", so let's try to assume robust behavior.
        // If the backend has GET /categories/:slug (which admin service suggests it does), we should use it.
        // Let's assume GET /categories/:slug exists as is standard rest.

        try {
            const res = await fetch(`${API_URL}/${slug}`);
            if (res.status === 404) return undefined;
            if (!res.ok) throw new Error('API Error');
            return res.json();
        } catch (e) {
            // Fallback to searching in getAll only if specific endpoint fails or isn't implemented
            const all = await categoriesService.getAll();
            return all.find(c => c.slug === slug);
        }
    }
}
