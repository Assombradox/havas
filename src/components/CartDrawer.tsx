import React from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';

import type { CartItem } from '../context/CartContext';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
    isOpen,
    onClose,
    items,
    onUpdateQuantity,
    onRemoveItem
}) => {
    // Basic Calculations
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => {
        const price = item.discountedPrice || item.unitPrice;
        return sum + (price * item.quantity);
    }, 0);

    const formatPrice = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // Dynamic header text pluralization
    const headerText = `Minha Sacola (${totalItems} ${totalItems === 1 ? 'item' : 'itens'})`;

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-[60] transition-opacity animate-in fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-[90%] max-w-md bg-white z-[70] shadow-xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">{headerText}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Promotional Banner */}
                <div className="bg-red-50 px-5 py-3 border-b border-red-100">
                    <p className="text-xs font-medium text-red-700 text-center">
                        Frete grátis para compras acima de R$ 299,00
                    </p>
                </div>

                {/* Product List */}
                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            {/* Product Image */}
                            <div className="w-20 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                                            {item.name}
                                        </h3>
                                        <button
                                            onClick={() => onRemoveItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.color} | {item.size}
                                    </p>
                                </div>

                                <div className="flex items-end justify-between mt-2">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center border border-gray-200 rounded-md h-8">
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium text-gray-900">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right">
                                        {item.discountedPrice ? (
                                            <>
                                                <span className="block text-[10px] text-gray-400 line-through">
                                                    {formatPrice(item.unitPrice)}
                                                </span>
                                                <span className="block text-sm font-bold text-gray-900">
                                                    {formatPrice(item.discountedPrice)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="block text-sm font-bold text-gray-900">
                                                {formatPrice(item.unitPrice)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {items.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <p className="text-gray-500 mb-4">Sua sacola está vazia</p>
                            <button
                                onClick={onClose}
                                className="text-sm font-bold text-red-600 underline"
                            >
                                Ver produtos
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 bg-white p-5 space-y-4">
                    {/* Summary */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            Resumo do pedido ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                            {formatPrice(subtotal)}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                onClose();
                                window.history.pushState({}, '', '/checkout');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                                window.scrollTo(0, 0);
                            }}
                            className="w-full bg-black text-white h-12 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors"
                        >
                            Ver sacola
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-transparent text-gray-500 h-10 rounded-lg font-medium text-sm hover:text-gray-900 transition-colors"
                        >
                            Seguir comprando
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
