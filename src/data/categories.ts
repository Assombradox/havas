import categoryChinelos from '../assets/category-chinelos.png';
import categoryRasteirinhas from '../assets/category-rasteirinhas.png';
import categoryfarm from '../assets/farm.png';
import categoryTime from '../assets/time.png';
import categoryPride from '../assets/pride.png';
import categoryGlitter from '../assets/glitter.png';
import categoryFloral from '../assets/floral.png';

// Import raw data from JSON
import categoriesData from './categories.json';
import type { CategoryConfig } from '../types/Category';

// Re-export type for compatibility
export type { CategoryConfig };

// Map string keys to imported assets
export const imageMap: Record<string, string> = {
    categoryChinelos,
    categoryRasteirinhas,
    categoryfarm,
    categoryTime,
    categoryPride,
    categoryGlitter,
    categoryFloral
};

// Hydrate the JSON data with actual image assets
export const categories: CategoryConfig[] = categoriesData.map(c => ({
    ...c,
    image: imageMap[c.image] || c.image, // Fallback to string if not found (or if already URL)
    type: c.type as 'category' | 'collection' // Ensure type safety
}));

export const getCategoryBySlug = (slug: string): CategoryConfig | undefined => {
    return categories.find(c => c.slug === slug);
};
