import React, { useState } from 'react';
import { optimizeImage } from '../utils/imageOptimization';
import { Star } from 'lucide-react';
import type { Product } from '../data/products';

interface CategoryProductGridProps {
    products: Product[];
}

const CategoryProductGrid: React.FC<CategoryProductGridProps> = ({ products }) => {
    const [visibleCount, setVisibleCount] = useState(10);
    const visibleProducts = products.slice(0, visibleCount);
    const hasMore = visibleCount < products.length;

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    const navigateToProduct = (slug: string) => {
        const path = `/produto/${slug}`;
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo(0, 0);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const calculateDiscount = (original: number | undefined, current: number) => {
        if (!original || original <= current) return null;
        const discount = Math.round(((original - current) / original) * 100);
        return `${discount}% OFF`;
    };

    return (
        <section className="w-full bg-white pb-8">
            {/* Grid Container */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-4">
                {visibleProducts.map((product) => {
                    const mainImage = product.colors?.[0]?.images?.[0] || product.colors?.[0]?.thumbnail || '';
                    const discountBadge = calculateDiscount(product.originalPrice, product.price);

                    return (
                        <div
                            key={product.id}
                            onClick={() => navigateToProduct(product.slug)}
                            className="cursor-pointer group"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/4] mb-3 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={optimizeImage(mainImage, 400)}
                                    alt={product.name}
                                    width="400"
                                    height="400"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {discountBadge && (
                                    <span className="absolute top-0 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
                                        -{discountBadge}
                                    </span>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col gap-1">
                                {/* Rating */}
                                <div className="flex items-center gap-1">
                                    <div className="flex text-red-600">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-transparent stroke-current'}`}
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

            {/* Pagination Button */}
            {hasMore && (
                <div className="flex justify-center mt-8 px-4">
                    <button
                        onClick={handleShowMore}
                        className="w-full max-w-xs py-3 border border-black bg-transparent text-black font-bold uppercase tracking-wide text-sm hover:bg-black hover:text-white transition-colors"
                    >
                        Mostrar mais
                    </button>
                </div>
            )}
        </section>
    );
};

export default CategoryProductGrid;
