import React from 'react';
import categoryfarm from '../assets/farm.png';
import categoryTime from '../assets/time.png';
import categoryPride from '../assets/pride.png';
import categoryGlitter from '../assets/glitter.png';
import categoryFloral from '../assets/floral.png';

interface Category {
    id: number;
    name: string;
    image: string;
}

const categories: Category[] = [
    {
        id: 1,
        name: "FARM",
        image: categoryfarm
    },
    {
        id: 2,
        name: "Times de futebol",
        image: categoryTime
    },
    {
        id: 3,
        name: "Pride",
        image: categoryPride
    },
    {
        id: 4,
        name: "Glitter",
        image: categoryGlitter
    },
    {
        id: 5,
        name: "Floral",
        image: categoryFloral
    }
];

const CategoryCarousel2: React.FC = () => {
    return (
        <section className="w-full py-6 bg-white">
            {/* Section Header */}
            <div className="px-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">Coleções especiais</h2>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto px-4 pb-4 gap-4 scrollbar-hide">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="flex-none w-32 cursor-pointer group"
                    >
                        {/* Image Container */}
                        <div className="w-full aspect-[2/3] mb-2 rounded-lg overflow-hidden relative">
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
                        <h3 className="text-sm font-medium text-gray-900 text-center">
                            {category.name}
                        </h3>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryCarousel2;
