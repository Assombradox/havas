import React, { useState } from 'react';
import { QrCode, Lock, CreditCard, AlertCircle } from 'lucide-react';
import { createPixPayment } from '../../../services/pixService';
import { useCheckout } from '../../../context/CheckoutContext';
import { useCart } from '../../../context/CartContext'; // Import CartContext

interface PaymentStepProps {
    onBack: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ onBack }) => {
    const { checkoutData } = useCheckout();
    const { cartItems, subtotal } = useCart(); // Use CartContext

    // Mock Data from Context
    const contactEmail = checkoutData.contact.email || "email@exemplo.com";
    const shippingAddress = `${checkoutData.address.street}, ${checkoutData.address.number}` +
        (checkoutData.address.complement ? ` - ${checkoutData.address.complement}` : '') +
        ` - ${checkoutData.address.city}/${checkoutData.address.state}`;

    const deliveryOption = checkoutData.delivery.method;
    const deliveryEstimated = checkoutData.delivery.deadline || "Indisponível";

    // Integration State
    const [isLoading, setIsLoading] = useState(false);

    // Component State
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handlePayment = async () => {
        setIsLoading(true);

        const fullName = `${checkoutData.contact.name} ${checkoutData.contact.lastName}`.trim() || "Cliente Checkout";

        try {
            const response = await createPixPayment({
                customerName: fullName,
                customerEmail: checkoutData.contact.email,
                customerCpf: checkoutData.contact.cpf,
                customerPhone: checkoutData.contact.phone,
                shippingAddress: { // Matches backend now
                    zip: checkoutData.address.zip,
                    street: checkoutData.address.street,
                    number: checkoutData.address.number,
                    neighborhood: checkoutData.address.neighborhood,
                    city: checkoutData.address.city,
                    state: checkoutData.address.state,
                    complement: checkoutData.address.complement
                },
                amount: subtotal,
                items: cartItems.map(item => ({
                    productId: item.id, // Critical: Send ID for Backend Snapshot
                    title: item.name,
                    quantity: item.quantity,
                    tangible: true,
                    unitPrice: (item.discountedPrice || item.unitPrice) * 100
                })),
                metadata: {
                    utm: (() => {
                        const searchParams = new URLSearchParams(window.location.search);
                        return {
                            src: searchParams.get('src') || null,
                            sck: searchParams.get('sck') || null,
                            utm_source: searchParams.get('utm_source') || null,
                            utm_medium: searchParams.get('utm_medium') || null,
                            utm_campaign: searchParams.get('utm_campaign') || null,
                            utm_content: searchParams.get('utm_content') || null,
                            utm_term: searchParams.get('utm_term') || null
                        };
                    })()
                }
            });

            console.log("PIX Created:", response);

            // Navigate to PIX Page with data
            // Navigate to PIX Page with ID in URL (Resilient Flow)
            const pixUrl = `/checkout/pix/${response.paymentId}`;
            window.history.pushState({}, '', pixUrl);
            // Force a re-render/location check since we are using a custom simple router in App.tsx
            window.dispatchEvent(new PopStateEvent('popstate'));

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Erro ao criar pagamento via PIX. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const isButtonEnabled = selectedMethod === 'pix' && termsAccepted;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 animate-in fade-in slide-in-from-right-2">

            {/* Recap Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
                {/* Contact Recap */}
                <div className="flex justify-between items-start p-4 border-b border-gray-200 bg-gray-50/50">
                    <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Contato</span>
                        <span className="text-sm text-gray-900 font-medium">{contactEmail}</span>
                    </div>
                    <button className="text-xs text-blue-600 font-bold hover:underline">
                        Alterar
                    </button>
                </div>

                {/* Address Recap */}
                <div className="flex justify-between items-start p-4 border-b border-gray-200 bg-gray-50/50">
                    <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Enviar para</span>
                        <span className="text-sm text-gray-900 font-medium leading-relaxed block max-w-[200px]">
                            {shippingAddress}
                        </span>
                    </div>
                    <button className="text-xs text-blue-600 font-bold hover:underline">
                        Alterar
                    </button>
                </div>

                {/* Delivery Recap */}
                <div className="flex justify-between items-start p-4 bg-gray-50/50">
                    <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Entrega</span>
                        <span className="text-sm text-gray-900 font-medium block">
                            {deliveryOption} — Grátis
                        </span>
                        <span className="text-xs text-gray-500 block mt-0.5">
                            Prazo: {deliveryEstimated}
                        </span>
                    </div>
                </div>
            </div>

            {/* Payment Method Section */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Pagamento</h2>

                {/* Notification Badge */}
                <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded mb-4 flex gap-2 items-center">
                    <Lock className="w-3 h-3" />
                    <span>Todas as transações são seguras e criptografadas.</span>
                </div>

                {/* PIX Option */}
                <div
                    onClick={() => setSelectedMethod('pix')}
                    className={`
                        relative border rounded-none p-4 cursor-pointer flex items-center gap-4 transition-all mb-4
                        ${selectedMethod === 'pix'
                            ? 'border-black bg-gray-50 ring-1 ring-black'
                            : 'border-gray-200 hover:border-gray-300'
                        }
                    `}
                >
                    <div className="flex items-center justify-center w-5 h-5">
                        <input
                            type="radio"
                            checked={selectedMethod === 'pix'}
                            onChange={() => setSelectedMethod('pix')}
                            className="w-4 h-4 text-black focus:ring-black cursor-pointer"
                        />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">PIX</span>
                            <span className="bg-[#D4E157] text-[10px] font-bold px-1.5 py-0.5 rounded-sm text-gray-800 uppercase">
                                Aprovação imediata
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Use o app do seu banco para escanear o código QR ou colar a chave PIX.
                        </p>
                    </div>

                    <QrCode className="w-6 h-6 text-gray-400" />
                </div>

                {/* Credit Card Option (Restricted) */}
                <div
                    onClick={() => setSelectedMethod('credit_card')}
                    className={`
                        relative border rounded-none p-4 cursor-pointer flex flex-col gap-4 transition-all
                        ${selectedMethod === 'credit_card'
                            ? 'border-[#e00000] bg-orange-50/10 ring-1 ring-[#e00000]'
                            : 'border-gray-200 hover:border-gray-300'
                        }
                    `}
                >
                    <div className="flex items-center gap-4 w-full">
                        <div className="flex items-center justify-center w-5 h-5">
                            <input
                                type="radio"
                                checked={selectedMethod === 'credit_card'}
                                onChange={() => setSelectedMethod('credit_card')}
                                className="w-4 h-4 text-[#e00000] focus:ring-[#e00000] cursor-pointer"
                            />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-900">Cartão de Crédito</span>
                                <span className="bg-gray-100 text-[10px] font-bold px-1.5 py-0.5 rounded-sm text-gray-600 uppercase border border-gray-200">
                                    Até 12x
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Visa, Mastercard, Elo, Hipercard e outros.
                            </p>
                        </div>

                        <CreditCard className="w-6 h-6 text-gray-400" />
                    </div>

                    {/* Restriction Message */}
                    {selectedMethod === 'credit_card' && (
                        <div className="mt-2 text-xs bg-orange-50 border-l-4 border-orange-400 p-3 text-orange-800 animate-in slide-in-from-top-1">
                            <div className="flex gap-2 items-start">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold mb-1">⚠️ Indisponível para esta modalidade de entrega.</p>
                                    <p className="leading-relaxed text-orange-800/80">
                                        Para cumprir o prazo da <strong>Entrega Rápida/Agendada</strong>, nosso sistema requer confirmação bancária instantânea. Pagamentos via Cartão podem levar até 48h para compensar.
                                    </p>
                                    <p className="mt-2 font-medium text-orange-900">
                                        Por favor, utilize o <strong>PIX</strong> para aprovação imediata e envio prioritário.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Terms Acceptance */}
            <div className="mb-8">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-black rounded border-gray-300 focus:ring-black"
                    />
                    <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors leading-relaxed">
                        Declaro que li e concordo com os <a href="#" className="underline">Termos de Uso</a> e a <a href="#" className="underline">Política de Privacidade</a> da loja.
                    </span>
                </label>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={handlePayment}
                    disabled={!isButtonEnabled || isLoading}
                    className={`
                        w-full font-bold py-4 rounded-none transition-all text-base uppercase tracking-wide flex items-center justify-center gap-2
                        ${isButtonEnabled && !isLoading
                            ? 'bg-[#E50000] hover:bg-[#cc0000] text-white shadow-md transform active:scale-[0.99]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                            Processando...
                        </>
                    ) : selectedMethod === 'credit_card' ? (
                        "Selecione PIX para continuar"
                    ) : (
                        <>
                            <Lock className="w-4 h-4" />
                            PAGAR
                        </>
                    )}
                </button>

                <button
                    onClick={onBack}
                    className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors text-center"
                >
                    ← Voltar para entrega
                </button>
            </div>
        </div>
    );
};

export default PaymentStep;
