export interface ProductColor {
    id: string;
    name: string;
    images: string[];
    thumbnail: string;
}

export interface ProductSize {
    label: string;
    available: boolean;
}

export interface Product {
    id: string;
    slug: string;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    colors: ProductColor[];
    sizes: ProductSize[];
    categories: string[];
    color?: string;
    relatedProducts?: string[];
}
