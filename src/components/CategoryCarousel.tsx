import React, { useEffect, useState } from 'react';
import { optimizeImage } from '../utils/imageOptimization';
import { categoriesService } from '../services/storefront/categories.service';
import type { CategoryConfig } from '../types/Category';

const CategoryCarousel: React.FC = () => {
    // Filter categories by type 'category' and sort by order
    const [carouselCategories, setCarouselCategories] = useState<CategoryConfig[]>([]);

    useEffect(() => {
        const DISPLAY_ORDER = ['chinelos', 'slides', 'rasteirinhas', 'alpargatas'];

        categoriesService.getAll().then(all => {
            // Map strictly to the display order, ignoring missing categories
            const curated = DISPLAY_ORDER
                .map(slug => all.find(c => c.slug === slug))
                .filter((c): c is CategoryConfig => !!c);

            setCarouselCategories(curated);
        });
    }, []);

    const handleNavigation = (slug: string) => {
        const path = `/categoria/${slug}`;
        window.history.pushState({}, '', path);
        // Dispatch popstate to trigger App re-render
        window.dispatchEvent(new Event('popstate'));
        window.scrollTo(0, 0);
    };

    return (
        <section className="w-full py-6 bg-white">
            {/* Section Header */}
            <div className="px-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">Categorias</h2>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto px-4 pb-4 gap-4 scrollbar-hide">
                {carouselCategories.map((category) => (
                    <div
                        key={category.slug}
                        className="flex-none w-32 cursor-pointer group"
                        onClick={() => handleNavigation(category.slug)}
                    >
                        {/* Image Container */}
                        <div className="w-full aspect-[2/2] mb-2 rounded-lg overflow-hidden relative">
                            {/* Background color placeholder */}
                            <div className="w-full h-full bg-gray-100 transition-transform duration-300 group-hover:scale-105">
                                {category.image ? (
                                    <img
                                        src={optimizeImage(category.image, 400)}
                                        alt={category.title}
                                        width="400"
                                        height="400"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={`https://placehold.co/400x400/eee/999?text=${(category.title || '').substring(0, 3).toUpperCase()}`}
                                        alt={category.title}
                                        className="w-full h-full object-cover opacity-50"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Category Name */}
                        <h3 className="text-sm font-medium text-gray-900 text-center truncate">
                            {(category.title || category.name || '').replace('Havaianas ', '')}
                        </h3>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryCarousel;
