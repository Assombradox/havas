import React, { useState } from 'react';

interface CategoryHeaderProps {
    title: string;
    description?: string; // Optional to handle undefined gracefully
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ title, description }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // 1. Renderização Condicional: Se não tem descrição, retorna apenas o título
    if (!description || description.trim() === '') {
        return (
            <div className="w-full px-4 py-6 bg-white border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">
                    {title}
                </h1>
            </div>
        );
    }

    // 2. Lógica do Botão "Ver mais"
    const isLongText = description.length > 150;

    return (
        <div className="w-full px-4 py-6 bg-white border-b border-gray-100">
            {/* Title - Natural casing, bold, darker */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {title}
            </h1>

            {/* Description Wrapper */}
            <div className="relative">
                {/* 3. Estilo: line-clamp apenas se for longo e não estiver expandido */}
                <p
                    className={`text-sm text-gray-900 leading-relaxed transition-all duration-300 ${(!isExpanded && isLongText) ? 'line-clamp-3' : ''
                        }`}
                >
                    {description}
                </p>

                {/* Só exibe o botão se o texto for longo */}
                {isLongText && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-red-600 font-bold text-sm mt-1 hover:text-red-700 transition-colors focus:outline-none"
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? 'Ver menos' : 'Ver mais'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CategoryHeader;
