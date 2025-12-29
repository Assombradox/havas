import React from 'react';
import { Info } from 'lucide-react';

interface FixedBottomPurchaseBarProps {
    price: number;
    isSizeSelected: boolean;
    onAddToBag: () => void;
    onInfoClick: () => void;
}

const FixedBottomPurchaseBar: React.FC<FixedBottomPurchaseBarProps> = ({
    price,
    isSizeSelected,
    onAddToBag,
    onInfoClick
}) => {
    // Format price
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden">
            <div className="flex items-center gap-3 p-4">
                {/* Secondary Info Button */}
                <button
                    onClick={onInfoClick}
                    className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 active:bg-gray-100 transition-colors shrink-0"
                    aria-label="Informações do produto"
                >
                    <Info className="w-6 h-6" strokeWidth={1.5} />
                </button>

                {/* Primary Add to Bag Button */}
                <button
                    onClick={onAddToBag}
                    disabled={!isSizeSelected}
                    className={`flex-1 flex flex-col items-center justify-center h-12 rounded-lg transition-all
                        ${isSizeSelected
                            ? 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                        }
                    `}
                >
                    <span className="text-sm font-bold uppercase tracking-wide">
                        {isSizeSelected ? 'Adicionar à sacola' : 'Selecione um tamanho'}
                    </span>
                    {isSizeSelected && (
                        <span className="text-xs font-medium opacity-90">
                            {formattedPrice}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FixedBottomPurchaseBar;
