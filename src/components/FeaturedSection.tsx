import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { productsService } from '../services/storefront/products.service';
import type { Product } from '../types/Product';

interface FeaturedSectionProps {
    title: string;
    categorySlug: string;
    limit?: number;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({
    title,
    categorySlug,
    limit = 6
}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const allProducts = await productsService.getAll();
                let filtered = allProducts
                    .filter(p => p.categories && p.categories.includes(categorySlug));

                // Context Awareness: Gender Sort
                const params = new URLSearchParams(window.location.search);
                const gender = params.get('gender') || localStorage.getItem('havaianas_promo_gender');

                if (gender) {
                    const targetGender = gender.toLowerCase();
                    const isFemale = targetGender === 'feminino' || targetGender === 'female' || targetGender === 'mulher';
                    const isMale = targetGender === 'masculino' || targetGender === 'male' || targetGender === 'homem';

                    filtered = filtered.sort((a, b) => {
                        const getScore = (p: Product) => {
                            let score = 0;
                            const textToCheck = (p.name + ' ' + (p.categories || []).join(' ')).toLowerCase();

                            if (isFemale) {
                                if (textToCheck.includes('feminino') || textToCheck.includes('slim') || textToCheck.includes('glitter')) score += 100;
                                if (textToCheck.includes('unissex') || textToCheck.includes('neutro')) score += 50;
                            } else if (isMale) {
                                if (textToCheck.includes('masculino') || textToCheck.includes('power')) score += 100;
                                if (textToCheck.includes('unissex') || textToCheck.includes('neutro')) score += 50;
                            } else if (targetGender === 'neutral' || targetGender === 'unissex') {
                                // Neutral Logic
                                if (textToCheck.includes('pride') || textToCheck.includes('arco-íris') || textToCheck.includes('rainbow')) score += 100;
                                if (textToCheck.includes('unissex') || textToCheck.includes('brasil') || textToCheck.includes('neutro')) score += 80;

                                const hasNeutralColor = textToCheck.includes('preto') || textToCheck.includes('branco') || textToCheck.includes('azul') || textToCheck.includes('cinza') || textToCheck.includes('verde');
                                if (textToCheck.includes('top') && hasNeutralColor) score += 60;

                                if (p.categories && p.categories.includes('slide')) score += 50;
                            }
                            return score;
                        };

                        return getScore(b) - getScore(a);
                    });

                    // Persist for future visits (optional, good UX)
                    if (params.get('gender')) {
                        localStorage.setItem('havaianas_promo_gender', targetGender);
                    }
                }

                setProducts(filtered.slice(0, limit));
            } catch (error) {
                console.error('Failed to load filtered products:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [categorySlug, limit]);

    const navigateToProduct = (slug: string) => {
        const path = `/produto/${slug}`;
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
        window.scrollTo(0, 0);
    };

    const navigateToCategory = () => {
        const path = `/categoria/${categorySlug}`;
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
        window.scrollTo(0, 0);
    };

    if (loading) return null; // Or skeleton
    if (products.length === 0) return null;

    return (
        <section className="w-full py-6 bg-white">
            {/* Section Header */}
            <div className="flex justify-between items-center px-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <button
                    onClick={navigateToCategory}
                    className="bg-[#e00000] text-white px-4 py-2 text-sm font-bold rounded-none hover:bg-red-700 transition-colors"
                >
                    Ver Tudo
                </button>
            </div>

            {/* Horizontal Scroll Container (Restored) */}
            <div className="flex overflow-x-auto w-full px-4 pb-4 gap-4 snap-x snap-mandatory scrollbar-hide">
                {products.map((product) => {
                    // Safety check for image
                    const mainImage = product.colors?.[0]?.images?.[0] || product.colors?.[0]?.thumbnail || '';

                    // Format price helper
                    const format = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

                    // Calculate discount
                    const calculateDiscount = (original: number | undefined, current: number) => {
                        if (!original || original <= current) return null;
                        const discount = Math.round(((original - current) / original) * 100);
                        return `${discount}% OFF`;
                    };
                    const discountBadge = calculateDiscount(product.originalPrice, product.price);

                    return (
                        <div
                            key={product.id}
                            onClick={() => navigateToProduct(product.slug)}
                            className="flex-none w-[calc(50%-24px)] md:w-[calc(33%-24px)] lg:w-[calc(25%-24px)] snap-start cursor-pointer group flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/4] mb-0 bg-gray-100 rounded-lg overflow-hidden">
                                {mainImage ? (
                                    <img
                                        src={mainImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                        Sem Foto
                                    </div>
                                )}

                                {discountBadge && (
                                    <span className="absolute top-0 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
                                        -{discountBadge}
                                    </span>
                                )}

                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col gap-1 p-3">
                                {/* Rating */}
                                <div className="flex items-center gap-1">
                                    <div className="flex text-red-600">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'fill-transparent stroke-current'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-sm text-gray-700 font-normal leading-snug line-clamp-2 min-h-[40px]">
                                    {product.name}
                                </h3>

                                {/* Price */}
                                <div className="flex flex-col mt-1">
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-xs text-gray-400 line-through">
                                            {format(product.originalPrice)}
                                        </span>
                                    )}
                                    <span className="text-base font-bold text-gray-900">
                                        {format(product.price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default FeaturedSection;
