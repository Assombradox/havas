import { categories as localCategories, imageMap } from '../../data/categories';
import type { CategoryConfig } from '../../types/Category';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categories`;

const hydrate = (category: any): CategoryConfig => {
    return {
        ...category,
        id: category.id || category.slug,
        name: category.name || category.title || category.slug,
        title: category.title,
        image: imageMap[category.image] || category.image,
        type: (category.type as 'category' | 'collection') || 'category'
    };
}

export const categoriesService = {
    getAll: async (): Promise<CategoryConfig[]> => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();
            return data.map(hydrate);
        } catch (error) {
            console.warn('API unavailable, using fallback:', error);
            return localCategories;
        }
    },
    getBySlug: async (slug: string): Promise<CategoryConfig | undefined> => {
        // Backend has no GET /:slug for categories, so we fetch all
        const all = await categoriesService.getAll();
        return all.find(c => c.slug === slug);
    }
}
