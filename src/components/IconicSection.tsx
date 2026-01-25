import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { productsService } from '../services/storefront/products.service';
import type { Product } from '../types/Product';

interface IconicSectionProps {
    title: string;
    categorySlug: string;
}

const IconicSection: React.FC<IconicSectionProps> = ({ title, categorySlug }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const allProducts = await productsService.getAll();
                // Filter by category and allow more items for scrolling
                const filtered = allProducts
                    .filter(p => p.categories && p.categories.includes(categorySlug))
                    .slice(0, 10);
                setProducts(filtered);
            } catch (error) {
                console.error('Failed to load iconic products:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [categorySlug]);

    const navigateToProduct = (slug: string) => {
        const path = `/produto/${slug}`;
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
        window.scrollTo(0, 0);
    };

    if (loading) return null;
    if (products.length === 0) return null;

    return (
        <section className="w-full py-12 bg-white">
            <div className="px-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto w-full px-4 pb-4 gap-4 snap-x snap-mandatory scrollbar-hide">
                {products.map((product) => {
                    const mainImage = product.coverImage || product.colors?.[0]?.images?.[0] || product.colors?.[0]?.thumbnail || '';

                    return (
                        <div
                            key={product.id}
                            onClick={() => navigateToProduct(product.slug)}
                            className="group relative cursor-pointer snap-center min-w-[280px] md:min-w-[350px] lg:w-[calc(33%-16px)]"
                        >
                            {/* Image Container - Clean & Editorial */}
                            <div className="aspect-square bg-[#f5f5f7] rounded-none overflow-hidden mb-4">
                                {mainImage ? (
                                    <img
                                        src={mainImage}
                                        alt={product.name}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* Minimal Text Info */}
                            <div className="flex flex-col items-start text-left">
                                <h3 className="text-lg font-medium text-gray-900 leading-snug">
                                    {product.name}
                                </h3>
                                <div className="text-sm font-bold text-[#e00000] mt-1 flex items-center gap-1 group-hover:underline">
                                    Ver mais
                                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default IconicSection;
