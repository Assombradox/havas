import React, { useState } from 'react';
import { Truck, CheckCircle2, Calendar, Store } from 'lucide-react';
import { useCheckout } from '../../../context/CheckoutContext';

interface DeliveryStepProps {
    onNext: () => void;
    onBack: () => void;
}

const DeliveryStep: React.FC<DeliveryStepProps> = ({ onNext, onBack }) => {
    const { checkoutData, updateDelivery } = useCheckout();
    const [selectedOption, setSelectedOption] = useState('fast'); // Default to fast

    // Scheduled Delivery State
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledPeriod, setScheduledPeriod] = useState('manhã');
    const [scheduleError, setScheduleError] = useState('');

    // --- Helper: Format Date for Urgency Text ---
    const getFormattedDate = () => {
        const today = new Date();
        const day = today.getDate();
        const monthNames = [
            "janeiro", "fevereiro", "março", "abril", "maio", "junho",
            "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
        ];
        return `${day} de ${monthNames[today.getMonth()]}`;
    };

    const urgencyDate = getFormattedDate();

    // Min date for input (Today)
    const todayStr = new Date().toISOString().split('T')[0];

    const handleNext = () => {
        console.log("Delivery Next Clicked. URL Params:", window.location.search);
        if (!selectedOption || selectedOption === 'pickup') return;

        // Map selection to data
        let deliveryData = {
            method: 'Entrega Rápida',
            price: 0,
            deadline: 'Até 2 dias úteis'
        };

        if (selectedOption === 'scheduled') {
            if (!scheduledDate) {
                setScheduleError('Por favor, selecione uma data para a entrega.');
                return;
            }

            // Format date to BR standard
            const [year, month, day] = scheduledDate.split('-');
            const formattedDate = `${day}/${month}/${year}`;

            deliveryData = {
                method: 'Entrega Agendada',
                price: 0, // A combinar
                deadline: `${formattedDate} - Período da ${scheduledPeriod}`
            };
        }

        updateDelivery(deliveryData);
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
                        type="button"
                        onClick={onBack}
                        className="text-xs text-blue-600 font-bold hover:underline"
                    >
                        Alterar
                    </button>
                </div>
            </div>

            {/* Delivery Options */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">Método de entrega</h2>

            <div className="space-y-4 mb-8">
                {/* OPTION A: Fast Delivery (Default) */}
                <div
                    onClick={() => setSelectedOption('fast')}
                    className={`
                        relative border p-4 cursor-pointer flex items-start gap-4 transition-all rounded-none
                        ${selectedOption === 'fast'
                            ? 'border-[#e00000] bg-red-50/10 ring-1 ring-[#e00000]'
                            : 'border-gray-200 hover:border-gray-300'
                        }
                    `}
                >
                    <div className={`mt-1 p-1.5 rounded-full ${selectedOption === 'fast' ? 'bg-[#e00000] text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Truck className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-900 text-sm">Entrega Rápida</span>
                            <span className="font-bold text-green-600 text-sm">Grátis</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Receba em até 2 dias úteis</p>

                        {selectedOption === 'fast' && (
                            <p className="text-xs text-green-700 font-medium flex items-center gap-1 animate-in fade-in">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                Para pedidos finalizados até 23:59 de hoje ({urgencyDate})
                            </p>
                        )}
                    </div>
                    {selectedOption === 'fast' && (
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-[#e00000] text-white rounded-full p-1 shadow-sm">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    )}
                </div>

                {/* OPTION B: Scheduled Delivery */}
                <div
                    onClick={() => setSelectedOption('scheduled')}
                    className={`
                        relative border p-4 cursor-pointer flex flex-col gap-4 transition-all rounded-none
                        ${selectedOption === 'scheduled'
                            ? 'border-[#e00000] bg-red-50/10 ring-1 ring-[#e00000]'
                            : 'border-gray-200 hover:border-gray-300'
                        }
                    `}
                >
                    <div className="flex items-start gap-4 w-full">
                        <div className={`mt-1 p-1.5 rounded-full ${selectedOption === 'scheduled' ? 'bg-[#e00000] text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-gray-900 text-sm">Entrega Agendada</span>
                                <span className="font-bold text-gray-900 text-sm">A combinar</span>
                            </div>
                            <p className="text-sm text-gray-600">Prefiro agendar a data de entrega</p>
                        </div>
                        {selectedOption === 'scheduled' && (
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-[#e00000] text-white rounded-full p-1 shadow-sm">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    {/* Conditional Inputs for Schedule */}
                    {selectedOption === 'scheduled' && (
                        <div className="w-full mt-2 pt-4 border-t border-gray-200/50 animate-in slide-in-from-top-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Data</label>
                                    <input
                                        type="date"
                                        min={todayStr}
                                        value={scheduledDate}
                                        onChange={(e) => {
                                            setScheduledDate(e.target.value);
                                            setScheduleError('');
                                        }}
                                        className="w-full border border-gray-300 rounded-none px-3 py-2 text-sm focus:border-[#e00000] focus:ring-1 focus:ring-[#e00000] outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Período</label>
                                    <select
                                        value={scheduledPeriod}
                                        onChange={(e) => setScheduledPeriod(e.target.value)}
                                        className="w-full border border-gray-300 rounded-none px-3 py-2 text-sm focus:border-[#e00000] focus:ring-1 focus:ring-[#e00000] outline-none transition-colors bg-white"
                                    >
                                        <option value="manhã">Manhã (08h - 12h)</option>
                                        <option value="tarde">Tarde (13h - 18h)</option>
                                    </select>
                                </div>
                            </div>
                            {scheduleError && (
                                <p className="text-xs text-red-600 mt-2 font-medium">{scheduleError}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* OPTION C: Store Pickup (Disabled) */}
                <div
                    className="relative border border-gray-200 bg-gray-50 p-4 flex items-start gap-4 rounded-none opacity-60 cursor-not-allowed"
                >
                    <div className="mt-1 p-1.5 rounded-full bg-gray-200 text-gray-400">
                        <Store className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-500 text-sm">Retirar na loja</span>
                            <span className="font-bold text-gray-400 text-sm">Indisponível</span>
                        </div>
                        <p className="text-sm text-gray-500">Não disponível na sua região no momento.</p>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <button
                type="button"
                onClick={handleNext}
                disabled={!selectedOption || selectedOption === 'pickup'}
                className={`
                    w-full font-bold py-4 rounded-none transition-colors text-base uppercase tracking-wide mb-4
                    ${(!selectedOption || selectedOption === 'pickup')
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#E50000] hover:bg-[#cc0000] text-white'
                    }
                `}
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
