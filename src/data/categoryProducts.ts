const CLOUDINARY_URLS = {
    brasilLogo: 'https://res.cloudinary.com/ddcjebuni/image/upload/v1769454836/imgi_98_4110850-2079-brasil-logo-0_cgdi83.png',
    summerVibes: 'https://res.cloudinary.com/ddcjebuni/image/upload/v1769573591/havas-products/nghwcqgkmuneim8pugap.png',
    summerVibes2: 'https://res.cloudinary.com/ddcjebuni/image/upload/v1769573933/havas-products/m78rwue8hasssf3rav0o.png',
    glitter: 'https://res.cloudinary.com/ddcjebuni/image/upload/glitter_qzcud1.png',
};

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
    const images = [
        CLOUDINARY_URLS.brasilLogo,
        CLOUDINARY_URLS.summerVibes,
        CLOUDINARY_URLS.summerVibes2,
        CLOUDINARY_URLS.glitter
    ];
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
