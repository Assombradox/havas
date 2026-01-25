import React from 'react';
import { CheckCircle2, MessageCircle, ShoppingBag, Calendar, MapPin } from 'lucide-react';
import logo from '../../assets/logo.png';

// Fallback Mock Data
const MOCK_ORDER = {
    id: 'MOCK-123456',
    items: [
        {
            id: 'mock-1',
            name: 'Chinelo Havaianas Top',
            color: 'Preto',
            size: '39/40',
            quantity: 1,
            unitPrice: 49.99,
            image: 'https://havaianas.com.br/dw/image/v2/BDDJ_PRD/on/demandware.static/-/Sites-havaianas-master/default/dw12271876/product-images/4000029_0090_HAVAIANAS%20TOP_C.png'
        },
        {
            id: 'mock-2',
            name: 'Chinelo Slim Glitter',
            color: 'Dourado',
            size: '35/36',
            quantity: 1,
            unitPrice: 89.99,
            image: 'https://havaianas.com.br/dw/image/v2/BDDJ_PRD/on/demandware.static/-/Sites-havaianas-master/default/dw90295dae/product-images/4146975_0090_HAVAIANAS%20SLIM%20GLITTER%20II_C.png'
        }
    ],
    total: 139.98,
    shipping: {
        deadline: '3 dias úteis',
        address: {
            street: 'Av. Paulista',
            number: '1578',
            city: 'São Paulo',
            state: 'SP',
            zip: '01310-200'
        }
    }
};

const CheckoutSuccessPage: React.FC = () => {
    // 1. Safe State Access via Window History (Custom Router)
    const historyState = window.history.state as any; // Type as needed

    // We try to get the order from navigation state (real flow)
    // If missing, we fallback to MOCK_ORDER (debug/direct access)
    // We assume if state.order exists, it has the valid structure.
    const hasRealOrder = !!historyState?.order;
    const order = hasRealOrder ? historyState.order : MOCK_ORDER;

    // Helper to format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    // Address formatting fallback
    const address = order.shipping?.address;
    const fullAddress = address
        ? `${address.street}, ${address.number} - ${address.city}/${address.state}`
        : "Endereço não informado";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 font-sans pb-12">

            {/* Header with Logo */}
            <div className="w-full max-w-md flex justify-center py-6 mb-2">
                <img src={logo} alt="Logo" className="h-8 object-contain" />
            </div>

            {/* Success Message */}
            <div className="text-center mb-6 animate-in slide-in-from-top-2">
                <div className="inline-flex justify-center mb-3">
                    <CheckCircle2 className="w-12 h-12 text-[#e00000]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Pedido Confirmado!</h1>
                <p className="text-gray-600 text-sm">
                    Obrigado pela compra. Abaixo estão os detalhes do pedido.
                </p>
                {!hasRealOrder && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase rounded-sm border border-yellow-200">
                        Modo Visualização (Mock)
                    </span>
                )}
            </div>

            {/* Receipt Card */}
            <div className="w-full max-w-md bg-white border border-gray-200 shadow-sm overflow-hidden animate-in fade-in zoom-in duration-300 rounded-none">

                {/* Delivery Highlight */}
                <div className="bg-gray-50 p-4 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-[#e00000] mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-0.5">
                                Previsão de Entrega
                            </p>
                            <p className="font-bold text-gray-900 text-sm">
                                {order.shipping?.deadline || 'A definir'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Address Summary */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-0.5">
                                Enviar para
                            </p>
                            <p className="text-sm text-gray-600 leading-snug">
                                {fullAddress}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Product List */}
                <div className="p-4 bg-white">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-3 flex items-center gap-2">
                        <ShoppingBag className="w-3 h-3" />
                        Resumo da Compra
                    </p>

                    <div className="space-y-3 mb-4">
                        {order.items.map((item: any, idx: number) => (
                            <div key={item.id || idx} className="flex gap-3">
                                <div className="w-12 h-12 border border-gray-100 bg-gray-50 relative shrink-0">
                                    <span className="absolute -top-1.5 -right-1.5 bg-gray-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full z-10">
                                        {item.quantity}
                                    </span>
                                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-contain p-0.5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                                    <p className="text-xs text-gray-500">{item.color} / {item.size}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">
                                        {formatPrice((item.discountedPrice || item.unitPrice) * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total Row */}
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Total Pago</span>
                        <span className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="w-full max-w-md mt-6 space-y-3">

                {/* WhatsApp Proof Button */}
                <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-none">
                    <p className="text-xs text-center text-gray-500 mb-3 leading-relaxed">
                        Para garantir o envio imediato, envie seu comprovante agora:
                    </p>
                    <a
                        href="https://wa.me/5596991649290?text=Ol%C3%A1%2C%20acabei%20de%20fazer%20o%20pagamento%20do%20meu%20pedido%20via%20PIX%20e%20gostaria%20de%20enviar%20o%20comprovante."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3 rounded-none transition-colors text-sm uppercase tracking-wide flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="w-5 h-5 fill-current" />
                        Enviar Comprovante
                    </a>
                </div>

                <button
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-[#e00000] hover:bg-[#cc0000] text-white font-bold py-3 rounded-none transition-colors text-sm uppercase tracking-wide"
                >
                    Voltar para a Loja
                </button>
            </div>

        </div>
    );
};

export default CheckoutSuccessPage;
