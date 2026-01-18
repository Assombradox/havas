import React, { useState, useMemo } from 'react';
import { Truck, Calendar, Store, ChevronDown, ChevronUp } from 'lucide-react';

const DeliveryInfo: React.FC = () => {
    const [cep, setCep] = useState('');
    const [isCalculated, setIsCalculated] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    // Brazilian date formatter
    const getDeliveryPromiseDate = () => {
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long'
        };
        return new Intl.DateTimeFormat('pt-BR', options).format(today);
    };

    const deliveryPromiseDate = useMemo(() => getDeliveryPromiseDate(), []);

    // Min date for scheduler (Today + 2 days)
    const minDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 2);
        return date.toISOString().split('T')[0];
    }, []);

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);

        // Apply mask 00000-000
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        }

        setCep(value);
        // Reset calculation if user clears or changes input significantly? 
        // Requirements didn't specify, but it's good UX to reset if they start typing again
        if (value.length < 9) setIsCalculated(false);
    };

    const handleCalculate = () => {
        // Simple length validation
        if (cep.length === 9) { // 8 digits + 1 hyphen
            setIsCalculated(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCalculate();
        }
    };

    return (
        <section className="w-full font-sans mt-6 px-4">
            <div className="bg-[#d2d2d226] p-6">
                <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                            Disponibilidade de entrega
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            Calcule frete e prazo
                        </p>
                    </div>

                    {/* Input Area */}
                    <div>
                        <div className="flex gap-2 w-full">
                            <input
                                type="text"
                                value={cep}
                                onChange={handleCepChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite o seu CEP"
                                className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400"
                                maxLength={9}
                            />
                            <button
                                onClick={handleCalculate}
                                disabled={cep.length < 9}
                                className="bg-white border border-[#e00000] text-[#e00000] px-5 py-2 rounded-md text-sm font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:bg-gray-100 transition-colors"
                            >
                                Calcular
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                            Ao editar o CEP, as ofertas e produtos disponíveis para a sua região poderão mudar.
                        </p>
                    </div>

                    {/* Results Area - Only shown after calculation */}
                    {isCalculated && (
                        <div className="flex flex-col gap-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            {/* Option 1: Fast Delivery (Highlighted) */}
                            <div className="border border-green-600/30 bg-green-50/50 rounded-lg p-4 flex items-start gap-3">
                                <Truck className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-900">Entrega Rápida</span>
                                        <span className="text-sm font-bold text-green-700">Grátis</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Receba em até 24–48 horas
                                    </p>
                                    <p className="text-[10px] text-green-800 mt-1.5 font-medium">
                                        Para pedidos finalizados até 23:59 de hoje ({deliveryPromiseDate})
                                    </p>
                                </div>
                            </div>

                            {/* Option 2: Scheduled Delivery */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden transition-all">
                                <button
                                    onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                                    className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <Calendar className="w-5 h-5 text-gray-600 shrink-0" />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-900 block">Agendar entrega</span>
                                        <span className="text-xs text-gray-500 block mt-0.5">Escolha uma data para receber seu pedido</span>
                                    </div>
                                    {isScheduleOpen ? (
                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>

                                {/* Collapsible Content */}
                                {isScheduleOpen && (
                                    <div className="px-4 pb-4 animate-in slide-in-from-top-1">
                                        <label className="text-xs text-gray-500 mb-1.5 block">Selecione a data:</label>
                                        <input
                                            type="date"
                                            min={minDate}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:border-black focus:ring-1 focus:ring-black outline-none"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Option 3: Pickup in Store */}
                            <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                                <Store className="w-5 h-5 text-gray-600 shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900">Retirar na loja</span>
                                        <span className="text-sm font-bold text-green-700">Grátis</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Disponível para algumas regiões
                                    </p>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <p className="text-[10px] text-gray-400 mt-1">
                                *Prazos estimados após a confirmação do pagamento.
                            </p>
                        </div>
                    )}
                    )}
                </div>
            </div>
        </section>
    );
};

export default DeliveryInfo;
