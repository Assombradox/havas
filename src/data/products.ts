import type { Product, ProductColor, ProductSize } from '../types/Product';

// Re-export types for backward compatibility
export type { Product, ProductColor, ProductSize };

import productsData from './products.json';

// Cloudinary Asset URLs
const CLOUDINARY_URLS = {
    brasilLogo: 'https://res.cloudinary.com/ddcjebuni/image/upload/v1769454836/imgi_98_4110850-2079-brasil-logo-0_cgdi83.png',
    summerVibes: 'https://res.cloudinary.com/ddcjebuni/image/upload/v1769573591/havas-products/nghwcqgkmuneim8pugap.png',
    summerVibes2: 'https://res.cloudinary.com/ddcjebuni/image/upload/v1769573933/havas-products/m78rwue8hasssf3rav0o.png',
    glitter: 'https://res.cloudinary.com/ddcjebuni/image/upload/glitter_qzcud1.png',
    farmGeneric: 'https://res.cloudinary.com/ddcjebuni/image/upload/Farm_etsd1e.png',
    floral: 'https://res.cloudinary.com/ddcjebuni/image/upload/floral_raj3lv.jpg',
    jardimNoturno: 'https://res.cloudinary.com/ddcjebuni/image/upload/tbd-tbd-havaianas-top-jardim-noturno-0_eqcebh.png',
    farmFlor: 'https://res.cloudinary.com/ddcjebuni/image/upload/farm-flor-de-fita-26-0_qkghb0.png'
};

// Map string keys (from JSON) to Cloudinary Assets
export const imageMap: Record<string, string> = {
    // Farm Mar de Ondas (Mapping to Farm Generic/Specifics)
    farm1: CLOUDINARY_URLS.farmGeneric,
    farm2: CLOUDINARY_URLS.farmGeneric,
    farm3: CLOUDINARY_URLS.farmGeneric,
    farm4: CLOUDINARY_URLS.farmGeneric,
    farm5: CLOUDINARY_URLS.farmGeneric,

    // Specific Products
    product2: CLOUDINARY_URLS.floral,         // Farm Brisa Serena / Floral
    product3: CLOUDINARY_URLS.glitter,        // Aqua Glow
    product4: CLOUDINARY_URLS.brasilLogo,     // Top Logo Metalico (Fallback to Brasil Logo as it's safe)
    product5: CLOUDINARY_URLS.brasilLogo,     // Brasil Logo
    product6: CLOUDINARY_URLS.summerVibes2,   // Slim Summer Bliss
    product7: CLOUDINARY_URLS.brasilLogo,     // Brasil Logo Amarelo (Fallback)
    product8: CLOUDINARY_URLS.summerVibes,    // Top Summer Vibes
};

// Hydrate the JSON data with actual image assets
export const products: Product[] = productsData.map((p: any) => ({
    ...p,
    colors: p.colors.map((c: any) => ({
        ...c,
        thumbnail: imageMap[c.thumbnail] || (c.thumbnail.startsWith('http') ? c.thumbnail : CLOUDINARY_URLS.brasilLogo),
        images: c.images.map((img: string) => imageMap[img] || (img.startsWith('http') ? img : CLOUDINARY_URLS.brasilLogo))
    }))
}));

export const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(p => p.slug === slug);
};

export const getRelatedProducts = (currentId: string, limit = 4): Product[] => {
    return products.filter(p => p.id !== currentId).slice(0, limit);
};
