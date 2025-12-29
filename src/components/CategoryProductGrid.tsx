import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { categoryProducts } from '../data/categoryProducts';

const CategoryProductGrid: React.FC = () => {
    const [visibleCount, setVisibleCount] = useState(10);
    const visibleProducts = categoryProducts.slice(0, visibleCount);
    const hasMore = visibleCount < categoryProducts.length;

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const calculateDiscount = (original: number, current: number) => {
        if (original <= current) return null;
        const discount = Math.round(((original - current) / original) * 100);
        return `${discount}% OFF`;
    };

    return (
        <section className="w-full bg-white pb-8">
            {/* Grid Container */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-4">
                {visibleProducts.map((product) => {
                    const discountBadge = calculateDiscount(product.originalPrice, product.currentPrice);

                    return (
                        <div key={product.id} className="cursor-pointer group">
                            {/* Image Container */}
                            <div className="relative aspect-[3/4] mb-3 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={product.image}
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
                            <div className="flex flex-col gap-1">
                                {/* Rating (Reusing existing style) */}
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
                                    {product.originalPrice > product.currentPrice && (
                                        <span className="text-xs text-gray-400 line-through">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                    <span className="text-base font-bold text-gray-900">
                                        {formatPrice(product.currentPrice)}
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
