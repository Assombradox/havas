// Product1 unused
import product2 from '../assets/product-2.jpg';
import product3 from '../assets/product-3.jpg';
import product4 from '../assets/product-4.jpg';
import product5 from '../assets/product-5.jpg';
import product6 from '../assets/product-6.jpg';
import product7 from '../assets/product-7.jpg';
import product8 from '../assets/product-8.jpg';

// Specific assets for the detailed product
import farm1 from '../assets/farm-mar-de-ondas-1.jpg';
import farm2 from '../assets/farm-mar-de-ondas-2.jpg';
import farm3 from '../assets/farm-mar-de-ondas-3.jpg';
import farm4 from '../assets/farm-mar-de-ondas-4.jpg';
import farm5 from '../assets/farm-mar-de-ondas-5.jpg';

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
    description: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    colors: ProductColor[];
    sizes: ProductSize[];
    isNew?: boolean; // Helpful for UI badges
}

export const products: Product[] = [
    {
        id: "1001",
        slug: "chinelo-havaianas-farm-mar-de-ondas",
        name: "Chinelo Havaianas Farm Mar de Ondas",
        description: "A Sandália Havaianas Farm Mar de Ondas traz a vibração do verão brasileiro com estampas exclusivas e o conforto clássico que você já conhece. Perfeita para dias de sol e mar.",
        price: 29.90,
        originalPrice: 92.99,
        rating: 4.8,
        reviewCount: 124,
        isNew: true,
        colors: [
            {
                id: "marinho",
                name: "Marinho",
                thumbnail: farm1,
                images: [farm1, farm2, farm3, farm4, farm5]
            }
        ],
        sizes: [
            { label: "33/34", available: true },
            { label: "35/36", available: true },
            { label: "37/38", available: true },
            { label: "39/40", available: true },
            { label: "41/42", available: false }
        ]
    },
    {
        id: "1002",
        slug: "rasteirinha-havaianas-aqua-glow",
        name: "Rasteirinha Havaianas Aqua Glow",
        description: "Brilhe com a Rasteirinha Aqua Glow. Design sofisticado com tiras metálicas e solado ultra macio para o máximo conforto.",
        price: 59.90,
        originalPrice: 139.99,
        rating: 4.6,
        reviewCount: 42,
        isNew: true,
        colors: [
            {
                id: "dourado",
                name: "Dourado",
                thumbnail: product3,
                images: [product3]
            }
        ],
        sizes: [
            { label: "35/36", available: true },
            { label: "37/38", available: true },
            { label: "39/40", available: true }
        ]
    },
    {
        id: "1003",
        slug: "chinelo-havaianas-farm-brisa-serena",
        name: "Chinelo Havaianas Farm Brisa Serena",
        description: "Estampa floral delicada da coleção Farm. Um toque de natureza aos seus pés.",
        price: 29.90,
        originalPrice: 82.99,
        rating: 4.9,
        reviewCount: 89,
        isNew: true,
        colors: [
            {
                id: "floral",
                name: "Floral",
                thumbnail: product2,
                images: [product2]
            }
        ],
        sizes: [
            { label: "33/34", available: true },
            { label: "35/36", available: true },
            { label: "37/38", available: true }
        ]
    },
    {
        id: "1004",
        slug: "chinelo-havaianas-top-logo-metalico",
        name: "Chinelo Havaianas Top Logo Metálico",
        description: "O clássico modelo Top com um toque de modernidade no logo metálico.",
        price: 19.90,
        originalPrice: 49.99,
        rating: 4.5,
        reviewCount: 215,
        isNew: false,
        colors: [
            {
                id: "preto",
                name: "Preto",
                thumbnail: product4,
                images: [product4]
            }
        ],
        sizes: [
            { label: "37/38", available: true },
            { label: "39/40", available: true },
            { label: "41/42", available: true },
            { label: "43/44", available: true }
        ]
    },
    // Summer Grid Products
    {
        id: "2001",
        slug: "chinelo-havaianas-brasil-logo-azul",
        name: "Chinelo Havaianas Brasil Logo",
        description: "O legítimo chinelo brasileiro. Bandeira do Brasil nas tiras e muita história pra contar.",
        price: 24.50,
        originalPrice: 59.99,
        rating: 4.8,
        reviewCount: 3285,
        isNew: false,
        colors: [{ id: "azul", name: "Azul", thumbnail: product5, images: [product5] }],
        sizes: [{ label: "39/40", available: true }]
    },
    {
        id: "2002",
        slug: "chinelo-havaianas-slim-summer-bliss",
        name: "Chinelo Havaianas Slim Summer Bliss",
        description: "Modelagem slim com estampas vibrantes que celebram a alegria do verão.",
        price: 33.20,
        originalPrice: 57.99,
        rating: 4.4,
        reviewCount: 182,
        isNew: false,
        colors: [{ id: "rosa", name: "Rosa", thumbnail: product6, images: [product6] }],
        sizes: [{ label: "35/36", available: true }]
    },
    {
        id: "2003",
        slug: "chinelo-havaianas-brasil-logo-amarelo",
        name: "Chinelo Havaianas Brasil Logo Amarelo",
        description: "Clássico é clássico. A versão amarela do Brasil Logo para iluminar seu caminhar.",
        price: 23.20,
        originalPrice: 59.99,
        rating: 4.9,
        reviewCount: 3285,
        isNew: false,
        colors: [{ id: "amarelo", name: "Amarelo", thumbnail: product7, images: [product7] }],
        sizes: [{ label: "41/42", available: true }]
    },
    {
        id: "2004",
        slug: "chinelo-havaianas-top-summer-vibes",
        name: "Chinelo Havaianas Top Summer Vibes",
        description: "Good vibes only. Chinelo confortável com arte inspirada nas praias tropicais.",
        price: 29.90,
        originalPrice: 49.99,
        rating: 4.2,
        reviewCount: 21,
        isNew: false,
        colors: [{ id: "verde", name: "Verde", thumbnail: product8, images: [product8] }],
        sizes: [{ label: "39/40", available: true }]
    }
];

export const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(p => p.slug === slug);
};

export const getRelatedProducts = (currentId: string, limit = 4): Product[] => {
    return products.filter(p => p.id !== currentId).slice(0, limit);
};
