import React from 'react';
import { Star } from 'lucide-react';

interface PriceBlockProps {
    productName: string;
    originalPrice: number;
    currentPrice: number;
    rating: number;
    reviewCount: number;
}

const PriceBlock: React.FC<PriceBlockProps> = ({
    productName,
    originalPrice,
    currentPrice,
    rating,
    reviewCount
}) => {
    // Calculate discount percentage
    const hasDiscount = originalPrice > currentPrice;
    const discountPercentage = hasDiscount
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0;

    // Format currency
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    return (
        <div className="w-full px-4 py-4 bg-white">
            {/* Top Row: Discount Badge and Rating */}
            <div className={`flex items-center mb-2 ${hasDiscount ? 'justify-between' : 'justify-end'}`}>
                {hasDiscount && (
                    <div className="bg-[#D4E157] text-gray-900 text-xs font-bold px-2 py-1 rounded">
                        {discountPercentage}% OFF
                    </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-red-600 text-red-600' : 'text-red-600'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">({reviewCount})</span>
                </div>
            </div>

            {/* Product Name */}
            <h1 className="text-lg font-medium text-gray-900 mb-2 leading-tight">
                {productName}
            </h1>

            {/* Price Info */}
            <div className="flex flex-col">
                {hasDiscount && (
                    <span className="text-sm text-gray-400 line-through mb-1">
                        {formatPrice(originalPrice)}
                    </span>
                )}
                <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(currentPrice)}
                </span>
            </div>
        </div>
    );
};

export default PriceBlock;
