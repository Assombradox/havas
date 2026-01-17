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
export const categories: CategoryConfig[] = categoriesData.map((c: any) => ({
    ...c,
    // Garante ID (usa slug se não tiver)
    id: c.id || c.slug,
    // Garante Name (usa title ou slug se não tiver)
    name: c.name || c.title || c.slug,
    // Mantém title opcional para compatibilidade
    title: c.title,
    // Resolve imagem (mapa ou string direta)
    image: imageMap[c.image] || c.image,
    // Força a tipagem correta
    type: (c.type as 'category' | 'collection') || 'category'
}));

export const getCategoryBySlug = (slug: string): CategoryConfig | undefined => {
    return categories.find(c => c.slug === slug);
};
