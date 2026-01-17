import React, { useEffect, useState } from 'react';
import { categoriesService } from '../services/storefront/categories.service';
import type { CategoryConfig } from '../types/Category';

const CategoryCarousel: React.FC = () => {
    // Filter categories by type 'category' and sort by order
    const [carouselCategories, setCarouselCategories] = useState<CategoryConfig[]>([]);

    useEffect(() => {
        categoriesService.getAll().then(all => {
            const filtered = all
                .filter(c => c.type === 'category')
                .sort((a, b) => a.order - b.order);
            setCarouselCategories(filtered);
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
                                {category.image && (
                                    <img
                                        src={category.image}
                                        alt={category.title}
                                        className="w-full h-full object-cover"
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
