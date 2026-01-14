import React from 'react';
import { Star } from 'lucide-react';
import { products } from '../data/products';

const SummerProductGrid: React.FC = () => {
    // Filter only the summer products (ID starting with 200 for this demo, or just distinct items)
    // We added IDs 2001-2004 for Summer grid
    const summerProducts = products.filter(p => p.id.startsWith('200'));

    const navigateToProduct = (slug: string) => {
        const path = `/produto/${slug}`;
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo(0, 0);
    };

    const formatPrice = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    return (
        <section className="w-full py-6 bg-white">
            {/* Section Header */}
            <div className="flex justify-between items-center px-4 mb-4">
                <h2 className="text-2xl font-semibold text-design-black basis-2/3 sm:text-3xl">Verão é com as originais do Brasil</h2>
                <span className="text-sm font-bold text-red-600">Ver tudo</span>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto w-full px-4 pb-4 gap-4 snap-x snap-mandatory scrollbar-hide">
                {summerProducts.map((product) => {
                    const mainImage = product.colors?.[0]?.images?.[0] || product.colors?.[0]?.thumbnail || '';

                    return (
                        <div
                            key={product.id}
                            onClick={() => navigateToProduct(product.slug)}
                            className="flex-none w-[calc(50%-8px)] snap-start cursor-pointer group last:mr-4"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[3/4] mb-3 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col gap-1 p-3">
                                {/* Rating */}
                                <div className="flex items-center gap-1">
                                    <div className="flex text-red-600">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-current" />
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
                                    {product.originalPrice && (
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
