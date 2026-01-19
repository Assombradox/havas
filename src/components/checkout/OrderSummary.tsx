import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';

import { useCheckout } from '../../context/CheckoutContext';

const OrderSummary: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { cartItems, subtotal } = useCart();
    const { checkoutData } = useCheckout();

    const freight = checkoutData.delivery.price || 0;
    const total = subtotal + freight;

    const savings = cartItems.reduce((acc, item) => {
        const original = item.unitPrice;
        const final = item.discountedPrice || item.unitPrice;
        if (original > final) {
            return acc + ((original - final) * item.quantity);
        }
        return acc;
    }, 0);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    return (
        <div className="w-full bg-gray-50 border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-4 bg-gray-50 focus:outline-none"
            >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span>Resumo do pedido</span>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
                <div className="flex flex-col items-end leading-tight">
                    <span className="text-sm font-bold text-gray-900">{formatPrice(total)}</span>
                </div>
            </button>

            {/* Collapsible Content */}
            {isOpen && (
                <div className="px-4 pb-6 animate-in slide-in-from-top-2">
                    {/* Product Rows */}
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 py-4 border-t border-gray-200">
                            <div className="relative w-16 h-16 bg-white border border-gray-200">
                                <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full z-10">
                                    {item.quantity}
                                </span>
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{item.color} / {item.size}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                {item.discountedPrice && (
                                    <span className="text-xs text-gray-400 line-through">{formatPrice(item.unitPrice)}</span>
                                )}
                                <span className="text-sm font-medium text-gray-900">
                                    {formatPrice(item.discountedPrice || item.unitPrice)}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Totals */}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                        {savings > 0 && (
                            <div className="flex justify-between text-sm font-bold text-emerald-600 mb-2">
                                <span>Você economizou</span>
                                <span>{formatPrice(savings)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>

                        {/* Delivery Info */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Entrega ({checkoutData.delivery.method || 'A calcular'})</span>
                                <span className="text-green-600 font-bold uppercase text-xs">
                                    {checkoutData.delivery.price === 0 ? 'Grátis' : formatPrice(checkoutData.delivery.price)}
                                </span>
                            </div>
                            {checkoutData.delivery.deadline && (
                                <span className="text-xs text-gray-500 text-right">
                                    Previsão: {checkoutData.delivery.deadline}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderSummary;
