import product1 from '../assets/product-1.jpg';
import product2 from '../assets/product-2.jpg';
import product3 from '../assets/product-3.jpg';
import product4 from '../assets/product-4.jpg';

export interface CategoryProduct {
    id: number;
    name: string;
    slug: string;
    image: string;
    originalPrice: number;
    currentPrice: number;
    rating: number;
    reviewCount: number;
}

const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

export const categoryProducts: CategoryProduct[] = Array.from({ length: 24 }).map((_, index) => {
    const images = [product1, product2, product3, product4];
    const prices = [
        { original: 92.90, current: 29.90 },
        { original: 139.90, current: 59.90 },
        { original: 82.90, current: 29.90 },
        { original: 49.90, current: 19.90 },
        { original: 159.90, current: 89.90 },
        { original: 79.90, current: 79.90 }, // No discount
    ];

    const selectedPrice = prices[index % prices.length];
    const name = `Produto Exemplo ${index + 1} - Style ${String.fromCharCode(65 + (index % 5))}`;

    return {
        id: index + 1,
        name: name,
        slug: slugify(name),
        image: images[index % images.length],
        originalPrice: selectedPrice.original,
        currentPrice: selectedPrice.current,
        rating: 4.5 + (Math.random() * 0.5),
        reviewCount: Math.floor(Math.random() * 200)
    };
});
