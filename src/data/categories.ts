// Import raw data from JSON
import categoriesData from './categories.json';
import type { CategoryConfig } from '../types/Category';

// Re-export type for compatibility
export type { CategoryConfig };

const CLOUDINARY_URLS = {
    brasilLogo: 'https://res.cloudinary.com/ddcjebuni/image/upload/v1769454836/imgi_98_4110850-2079-brasil-logo-0_cgdi83.png',
    summerVibes: 'https://res.cloudinary.com/ddcjebuni/image/upload/v1769573591/havas-products/nghwcqgkmuneim8pugap.png',
    summerVibes2: 'https://res.cloudinary.com/ddcjebuni/image/upload/v1769573933/havas-products/m78rwue8hasssf3rav0o.png',
    glitter: 'https://res.cloudinary.com/ddcjebuni/image/upload/glitter_qzcud1.png',
    farmGeneric: 'https://res.cloudinary.com/ddcjebuni/image/upload/Farm_etsd1e.png',
    floral: 'https://res.cloudinary.com/ddcjebuni/image/upload/floral_raj3lv.jpg',
    jardimNoturno: 'https://res.cloudinary.com/ddcjebuni/image/upload/tbd-tbd-havaianas-top-jardim-noturno-0_eqcebh.png',
};

// Map string keys to Cloudinary Assets replacing local imports
export const imageMap: Record<string, string> = {
    categoryChinelos: CLOUDINARY_URLS.brasilLogo,
    categoryRasteirinhas: CLOUDINARY_URLS.summerVibes,
    categoryfarm: CLOUDINARY_URLS.farmGeneric,
    categoryTime: CLOUDINARY_URLS.jardimNoturno,
    categoryPride: CLOUDINARY_URLS.summerVibes2,
    categoryGlitter: CLOUDINARY_URLS.glitter,
    categoryFloral: CLOUDINARY_URLS.floral
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
