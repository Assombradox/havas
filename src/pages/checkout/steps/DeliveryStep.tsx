import React, { useState } from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { useCheckout } from '../../../context/CheckoutContext';

interface DeliveryStepProps {
    onNext: () => void;
    onBack: () => void;
}

const DeliveryStep: React.FC<DeliveryStepProps> = ({ onNext, onBack }) => {
    const { checkoutData, updateDelivery } = useCheckout();
    const [selectedOption, setSelectedOption] = useState('standard');

    const handleNext = () => {
        // Only one option for now, but scalable
        updateDelivery({
            method: 'Entrega Grátis',
            price: 0,
            deadline: '3-5 dias úteis'
        });
        onNext();
    };

    // Format address from context
    const fullAddress = `${checkoutData.address.street}, ${checkoutData.address.number}` +
        (checkoutData.address.complement ? ` - ${checkoutData.address.complement}` : '') +
        ` - ${checkoutData.address.neighborhood}`;

    const cityState = `${checkoutData.address.city} - ${checkoutData.address.state}`;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 animate-in fade-in slide-in-from-right-2">

            {/* Address Recap */}
            <div className="mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">Endereço de entrega</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {fullAddress}<br />
                            {cityState}<br />
                            CEP {checkoutData.address.zip}
                        </p>
                    </div>
                    <button
                        onClick={onBack}
                        className="text-xs text-blue-600 font-bold hover:underline"
                    >
                        Alterar
                    </button>
                </div>
            </div>

            {/* Delivery Options */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">Método de entrega</h2>

            <div
                className={`
                    relative border rounded-lg p-4 cursor-pointer flex items-center gap-4 transition-all mb-6
                    ${selectedOption === 'standard'
                        ? 'border-black bg-gray-50 ring-1 ring-black'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                `}
                onClick={() => setSelectedOption('standard')}
            >
                <div className="border border-gray-300 rounded-full p-2 bg-white">
                    <Truck className="w-5 h-5 text-gray-700" />
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-gray-900 text-sm">Entrega Grátis</span>
                        <span className="font-bold text-green-600 text-sm">Grátis</span>
                    </div>
                    <p className="text-xs text-gray-500">Chega em 3 a 5 dias úteis</p>
                </div>

                {selectedOption === 'standard' && (
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-black text-white rounded-full p-1">
                        <CheckCircle2 className="w-4 h-4" />
                    </div>
                )}
            </div>

            {/* CTA */}
            <button
                onClick={handleNext}
                className="w-full bg-[#E50000] hover:bg-[#cc0000] text-white font-bold py-4 rounded transition-colors text-base uppercase tracking-wide mb-4"
            >
                Ir para o pagamento
            </button>

            <button
                onClick={onBack}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
            >
                Voltar
            </button>
        </div>
    );
};

export default DeliveryStep;
