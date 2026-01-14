import React from 'react';
import { Star } from 'lucide-react';
import { products as allProducts, type Product } from '../data/products';

interface ProductGridProps {
    title?: string;
    products?: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({
    title = "Lançamentos",
    products = allProducts // Default to all products if none provided
}) => {

    // Custom navigation function since we can't use useNavigate from react-router in this simple router setup
    const navigateToProduct = (slug: string) => {
        const path = `/produto/${slug}`;
        window.history.pushState({}, '', path);
        // Dispatch event for App.tsx to pick up change
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo(0, 0);
    };

    return (
        <section className="w-full py-6 bg-white">
            {/* Section Header */}
            <div className="flex justify-between items-center px-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <span className="text-sm font-medium text-red-600">Ver tudo</span>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto w-full px-4 pb-4 gap-4 snap-x snap-mandatory scrollbar-hide">
                {products.map((product) => {
                    // Safety check for image
                    const mainImage = product.colors?.[0]?.images?.[0] || product.colors?.[0]?.thumbnail || '';

                    // Format price helper
                    const format = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

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

export default ProductGrid;
// Re-export types for backward compatibility
export type { Product } from '../data/products';
