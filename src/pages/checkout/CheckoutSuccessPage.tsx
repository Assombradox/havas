import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const CheckoutSuccessPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full animate-in zoom-in duration-300">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle2 className="w-16 h-16 text-green-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h1>
                <p className="text-gray-600 mb-8">
                    Seu pedido foi processado com sucesso. Você receberá os detalhes por e-mail.
                </p>

                <button
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-[#e00000] hover:bg-red-700 text-white font-bold py-3 rounded-none transition-colors"
                >
                    Voltar para a Loja
                </button>
            </div>
        </div>
    );
};

export default CheckoutSuccessPage;
