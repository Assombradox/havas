import React, { useState } from 'react';
import { Check } from 'lucide-react';
import type { ProductColor } from '../data/products';

export interface SizeOption {
    label: string;
    available: boolean;
}

interface SizeSelectorProps {
    colors: ProductColor[];
    // Sizes are fixed in logic but availability can change product to product
    sizesAvailable: string[];
    onColorSelect: (color: ProductColor) => void;
    onSizeSelect: (size: string) => void;
    hideColors?: boolean;
}

const FIXED_SIZES = [
    "33/34", "35/36", "37/38", "39/40", "41/42", "43/44"
];

const SizeSelector: React.FC<SizeSelectorProps> = ({
    colors,
    sizesAvailable,
    onColorSelect,
    onSizeSelect,
    hideColors = false
}) => {
    // Internal state
    // Default to first color and no size selected initially
    const [selectedColor, setSelectedColor] = useState<ProductColor>(colors[0]);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const handleColorClick = (color: ProductColor) => {
        setSelectedColor(color);
        onColorSelect(color);
    };

    const handleSizeClick = (size: string, isAvailable: boolean) => {
        if (!isAvailable) return;
        setSelectedSize(size);
        onSizeSelect(size);
    };

    return (
        <div className="w-full px-4 py-4 bg-white border-t border-gray-100">
            {/* Color Selection (Visual Only if hideColors is true, or completely hidden? Prompt says "Selector de cores simples" in PDP) */}
            {/* If we strictly follow prompt, we replace this. Let's hide it if requested. */}

            {!hideColors && (
                <div className="mb-6">
                    <p className="text-sm text-gray-900 mb-3">
                        Cor: <span className="font-bold uppercase">{selectedColor.name}</span>
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {colors.map((color, index) => (
                            <button
                                key={index}
                                onClick={() => handleColorClick(color)}
                                className={`relative w-16 h-16 rounded-lg overflow-hidden flex-none border-2 transition-all ${selectedColor.name === color.name
                                    ? 'border-red-600'
                                    : 'border-transparent hover:border-gray-200'
                                    }`}
                            >
                                <img
                                    src={color.thumbnail}
                                    alt={color.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Selected Checkmark Overlay */}
                                {selectedColor.name === color.name && (
                                    <div className="absolute top-1 right-1 bg-red-600 rounded-full p-0.5">
                                        <Check className="w-2 h-2 text-white" strokeWidth={4} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Size Selection */}
            <div>
                <p className="text-sm text-gray-900 mb-3">
                    Tamanho: {selectedSize && <span className="font-bold">{selectedSize}</span>}
                </p>

                <div className="grid grid-cols-4 gap-2">
                    {FIXED_SIZES.map((size) => {
                        const isAvailable = sizesAvailable.includes(size);
                        const isSelected = selectedSize === size;

                        return (
                            <button
                                key={size}
                                onClick={() => handleSizeClick(size, isAvailable)}
                                disabled={!isAvailable}
                                className={`
                                    relative h-10 text-xs font-medium rounded border transition-all flex items-center justify-center
                                    ${!isAvailable
                                        ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                                        : isSelected
                                            ? 'border-black text-black bg-white ring-1 ring-black'
                                            : 'border-gray-300 text-gray-900 hover:border-gray-400'
                                    }
                                `}
                            >
                                {size}
                                {/* Diagonal Strike for Unavailable */}
                                {!isAvailable && (
                                    <div className="absolute w-[120%] h-[1px] bg-gray-300 rotate-[20deg]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SizeSelector;
