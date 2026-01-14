import type { Product, ProductColor, ProductSize } from '../types/Product';

// Re-export types for backward compatibility
export type { Product, ProductColor, ProductSize };

import product2 from '../assets/product-2.jpg';
import product3 from '../assets/product-3.jpg';
import product4 from '../assets/product-4.jpg';
import product5 from '../assets/product-5.jpg';
import product6 from '../assets/product-6.jpg';
import product7 from '../assets/product-7.jpg';
import product8 from '../assets/product-8.jpg';

import farm1 from '../assets/farm-mar-de-ondas-1.jpg';
import farm2 from '../assets/farm-mar-de-ondas-2.jpg';
import farm3 from '../assets/farm-mar-de-ondas-3.jpg';
import farm4 from '../assets/farm-mar-de-ondas-4.jpg';
import farm5 from '../assets/farm-mar-de-ondas-5.jpg';

import productsData from './products.json';

// Map string keys to imported assets
export const imageMap: Record<string, string> = {
    product2, product3, product4, product5, product6, product7, product8,
    farm1, farm2, farm3, farm4, farm5
};

// Hydrate the JSON data with actual image assets
export const products: Product[] = productsData.map((p: any) => ({
    ...p,
    colors: p.colors.map((c: any) => ({
        ...c,
        thumbnail: imageMap[c.thumbnail] || c.thumbnail,
        images: c.images.map((img: string) => imageMap[img] || img)
    }))
}));

export const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(p => p.slug === slug);
};

export const getRelatedProducts = (currentId: string, limit = 4): Product[] => {
    return products.filter(p => p.id !== currentId).slice(0, limit);
};
