import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { productsService } from '../services/storefront/products.service';
import type { Product } from '../types/Product';

const SummerProductGrid: React.FC = () => {
    // Filter only the summer products (ID starting with 200 for this demo)
    const [summerProducts, setSummerProducts] = useState<Product[]>([]);

    useEffect(() => {
        const load = async () => {
            const all = await productsService.getAll();
            // We added IDs 2001-2004 for Summer grid
            setSummerProducts(all.filter(p => p.id.startsWith('200')));
        };
        load();
    }, []);

    const navigateToProduct = (slug: string) => {
        const path = `/produto/${slug}`;
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo(0, 0);
    };

    const formatPrice = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    const navigateToCategory = () => {
        // Assuming Summer directs to a general category or specific summer one
        const path = '/category';
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo(0, 0);
    };

    return (
        <section className="w-full py-6 bg-white">
            {/* Section Header */}
            <div className="flex justify-between items-center px-4 mb-4">
                <h2 className="text-2xl font-semibold text-design-black basis-2/3 sm:text-3xl">Verão é com as originais do Brasil</h2>
                <button
                    onClick={navigateToCategory}
                    className="bg-[#e00000] text-white px-4 py-2 text-sm font-bold rounded-none hover:bg-red-700 transition-colors"
                >
                    Ver Tudo
                </button>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto w-full px-4 pb-4 gap-4 snap-x snap-mandatory scrollbar-hide">
                {summerProducts.map((product) => {
                    const mainImage = product.colors?.[0]?.images?.[0] || product.colors?.[0]?.thumbnail || '';

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
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {discountBadge && (
                                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
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
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                    <span className="text-base font-bold text-gray-900">
                                        {formatPrice(product.price)}
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

export default SummerProductGrid;
