import type { CategoryConfig } from '../../types/Category';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categories`;

export const categoriesAdminService = {
    getAll: async (): Promise<CategoryConfig[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data: CategoryConfig[] = await response.json();
        return data.sort((a, b) => (a.order || 0) - (b.order || 0));
    },

    getById: async (slug: string): Promise<CategoryConfig | undefined> => {
        const response = await fetch(`${API_URL}/${slug}`);
        if (!response.ok) {
            // It might return 404
            console.warn('Category not found:', slug);
            return undefined;
        }
        return response.json();
    },

    save: async (category: CategoryConfig): Promise<void> => {
        // Check existence by slug to decide PUT or POST
        // Similar to products, we can try to fetch it or check the list.
        // Let's try to fetch the specific one.
        const existing = await categoriesAdminService.getById(category.slug);

        if (existing) {
            const response = await fetch(`${API_URL}/${category.slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });
            if (!response.ok) throw new Error('Failed to update category');
        } else {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });
            if (!response.ok) throw new Error('Failed to create category');
        }
    },

    delete: async (): Promise<void> => {
        console.warn('Delete not implemented in V1 Backend');
    }
};

