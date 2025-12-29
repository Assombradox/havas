import React from 'react';
import categoryChinelos from '../assets/category-chinelos.png';
import categoryRasteirinhas from '../assets/category-rasteirinhas.png';

interface Category {
    id: number;
    name: string;
    image: string;
}

const categories: Category[] = [
    {
        id: 1,
        name: "Chinelos",
        image: categoryChinelos
    },
    {
        id: 2,
        name: "Rasteirinhas",
        image: categoryRasteirinhas
    }
];

const CategoryCarousel: React.FC = () => {
    return (
        <section className="w-full py-6 bg-white">
            {/* Section Header */}
            <div className="px-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">Categorias</h2>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto px-4 pb-4 gap-4 scrollbar-hide">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="flex-none w-32 cursor-pointer group"
                    >
                        {/* Image Container */}
                        <div className="w-full aspect-[2/2] mb-2 rounded-lg overflow-hidden relative">
                            {/* Background color based on category for visual distinction if image fails or transparent */}
                            <div className={`w-full h-full ${category.id === 1 ? 'bg-[#D4E157]' : 'bg-[#E57373]'} transition-transform duration-300 group-hover:scale-105`}>
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Category Name */}
                        <h3 className="text-x1 font-medium text-gray-900 text-center">
                            {category.name}
                        </h3>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryCarousel;
