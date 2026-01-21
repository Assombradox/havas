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
        // Ensure ID is present for MongoDB backend
        const payload = {
            ...category,
            id: category.id || category.slug
        };

        // Check existence by slug to decide PUT or POST
        const existing = await categoriesAdminService.getById(category.slug);

        if (existing) {
            const response = await fetch(`${API_URL}/${category.slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to update category');
        } else {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to create category');
        }
    },

    delete: async (slug: string): Promise<void> => {
        const response = await fetch(`${API_URL}/${slug}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete category');
    }
};

