import React, { useState } from 'react';

interface CategoryHeaderProps {
    title: string;
    description: string;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ title, description }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full px-4 py-6 bg-white border-b border-gray-100">
            {/* Title - Natural casing, bold, darker */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {title}
            </h1>

            {/* Description Wrapper */}
            <div className="relative">
                <p
                    className={`text-sm text-gray-900 leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'
                        }`}
                >
                    {description}
                </p>

                {/* Toggle Action */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-red-600 font-bold text-sm mt-1 hover:text-red-700 transition-colors focus:outline-none"
                    aria-expanded={isExpanded}
                >
                    {isExpanded ? 'Ver menos' : 'Ver mais'}
                </button>
            </div>
        </div>
    );
};

export default CategoryHeader;
