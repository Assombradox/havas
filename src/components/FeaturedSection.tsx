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
    limit = 4
}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const allProducts = await productsService.getAll();
                const filtered = allProducts
                    .filter(p => p.categories && p.categories.includes(categorySlug))
                    .slice(0, limit);
                setProducts(filtered);
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

    if (loading) return null; // Or a skeleton loader
    if (products.length === 0) return null;

    return (
        <section className="w-full py-12 px-4 bg-white">
            <div className="max-w-screen-xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8 uppercase tracking-wide">
                    {title}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const mainImage = product.colors?.[0]?.images?.[0] || product.colors?.[0]?.thumbnail || '';

                        const format = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

                        const calculateDiscount = (original: number | undefined, current: number) => {
                            if (!original || original <= current) return null;
                            return Math.round(((original - current) / original) * 100);
                        };
                        const discountPercent = calculateDiscount(product.originalPrice, product.price);

                        return (
                            <div
                                key={product.id}
                                onClick={() => navigateToProduct(product.slug)}
                                className="group cursor-pointer flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-square bg-gray-100 overflow-hidden mb-3">
                                    {mainImage ? (
                                        <img
                                            src={mainImage}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                            Sem Foto
                                        </div>
                                    )}

                                    {discountPercent && (
                                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide z-10">
                                            -{discountPercent}% OFF
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex flex-col gap-1">
                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-1">
                                        <div className="flex text-red-600">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'fill-transparent stroke-current'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-sm text-gray-800 font-normal leading-tight line-clamp-2 h-[40px]">
                                        {product.name}
                                    </h3>

                                    {/* Price */}
                                    <div className="mt-1 flex flex-col">
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
            </div>
        </section>
    );
};

export default FeaturedSection;
