import React, { useState, useMemo } from 'react';
import { Truck, Calendar, Store, Check, Loader2 } from 'lucide-react';

const DeliveryInfo: React.FC = () => {
    const [cep, setCep] = useState('');
    const [isCalculated, setIsCalculated] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [selectedOption, setSelectedOption] = useState<'fast' | 'scheduled'>('fast');

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

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);

        // Apply mask 00000-000
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        }

        setCep(value);
        if (value.length < 9) {
            setIsCalculated(false);
        }
    };

    const handleCalculate = () => {
        if (cep.length === 9) {
            setIsCalculating(true);
            setIsCalculated(false);

            // Fake loading delay
            setTimeout(() => {
                setIsCalculating(false);
                setIsCalculated(true);
                setSelectedOption('fast'); // Default selection
            }, 1500);
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
                                disabled={isCalculating}
                            />
                            <button
                                onClick={handleCalculate}
                                disabled={cep.length < 9 || isCalculating}
                                className="bg-white border border-[#e00000] text-[#e00000] px-5 py-2 rounded-md text-sm font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:bg-gray-100 transition-colors min-w-[100px] flex items-center justify-center"
                            >
                                {isCalculating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Calcular"
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                            Ao editar o CEP, as ofertas e produtos disponíveis para a sua região poderão mudar.
                        </p>
                    </div>

                    {/* Results Area */}
                    {isCalculated && (
                        <div className="flex flex-col gap-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">

                            {/* Option 1: Fast Delivery */}
                            <button
                                onClick={() => setSelectedOption('fast')}
                                className={`
                                    relative rounded-lg p-4 flex items-start gap-3 transition-all text-left border
                                    ${selectedOption === 'fast'
                                        ? 'border-[#e00000] bg-white ring-1 ring-[#e00000]'
                                        : 'border-gray-200 bg-white hover:border-gray-300'}
                                `}
                            >
                                <Truck className={`w-5 h-5 mt-0.5 shrink-0 ${selectedOption === 'fast' ? 'text-[#e00000]' : 'text-gray-600'}`} />
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
                                {selectedOption === 'fast' && (
                                    <div className="absolute top-2 right-2 bg-[#e00000] rounded-full p-0.5">
                                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                    </div>
                                )}
                            </button>

                            {/* Option 2: Scheduled Delivery (No Date Input) */}
                            <button
                                onClick={() => setSelectedOption('scheduled')}
                                className={`
                                    relative rounded-lg p-4 flex items-start gap-3 transition-all text-left border
                                    ${selectedOption === 'scheduled'
                                        ? 'border-[#e00000] bg-white ring-1 ring-[#e00000]'
                                        : 'border-gray-200 bg-white hover:border-gray-300'}
                                `}
                            >
                                <Calendar className={`w-5 h-5 mt-0.5 shrink-0 ${selectedOption === 'scheduled' ? 'text-[#e00000]' : 'text-gray-600'}`} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-900">Entrega Agendada</span>
                                        <span className="text-sm font-bold text-gray-600">A combinar</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Prefiro agendar a data de entrega
                                    </p>
                                </div>
                                {selectedOption === 'scheduled' && (
                                    <div className="absolute top-2 right-2 bg-[#e00000] rounded-full p-0.5">
                                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                    </div>
                                )}
                            </button>

                            {/* Option 3: Pickup (Static Info) */}
                            <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-3 bg-white">
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

                            <p className="text-[10px] text-gray-400 mt-1">
                                *Prazos estimados após a confirmação do pagamento.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default DeliveryInfo;
