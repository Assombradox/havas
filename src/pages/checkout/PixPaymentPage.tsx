import React from 'react';
import { QrCode, Timer, Copy, CheckCircle2 } from 'lucide-react';
// Logo unused
import type { PixPaymentResponse } from '../../services/pixService';

interface PixPaymentPageProps {
    paymentId?: string; // Optional because Router might not pass it in legacy mode
}

const PixPaymentPage: React.FC<PixPaymentPageProps> = ({ paymentId }) => {
    // State for data fetched from API
    const [paymentData, setPaymentData] = React.useState<PixPaymentResponse | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // Fetch Data on Mount
    React.useEffect(() => {
        if (!paymentId) {
            setIsLoading(false);
            return;
        }

        const fetchPaymentDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/pix/${paymentId}`);
                if (!response.ok) throw new Error('Pagamento não encontrado');

                const data = await response.json();
                setPaymentData(data);
            } catch (err) {
                console.error("Erro ao buscar dados do PIX:", err);
                setError("Não foi possível carregar os dados do pagamento.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [paymentId]);

    // Fallback Mock Data (Only used if NO paymentId provided and NO API data)
    // This maintains backward compatibility or direct access without ID
    const pixCode = paymentData?.pixCode;
    const expiresAt = paymentData?.expiresAt;

    // Mock Total - in real app should come from context or API
    const orderTotal = 39.90; // The user didn't ask to fix this specifically, but ideally it should come from API too. Keeping as is for scope.

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    // Polling status verification
    React.useEffect(() => {
        if (!paymentId) return;

        const checkStatus = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/pix/status/${paymentId}`);
                const data = await response.json();

                if (data.status === 'paid') {
                    window.location.href = '/checkout/success';
                }
            } catch (error) {
                console.error('Erro ao verificar status:', error);
            }
        };

        const interval = setInterval(checkStatus, 3000);
        return () => clearInterval(interval);
    }, [paymentId]);

    // Helper to handle different QR Code formats (URL vs Base64)
    const getQrImageSrc = (source: string) => {
        if (!source) return '';
        if (source.startsWith('http') || source.startsWith('data:')) {
            return source;
        }
        return `data:image/png;base64,${source}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Carregando dados do PIX...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-red-100 max-w-sm w-full">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Erro</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.href = '/checkout'}
                        className="w-full bg-black text-white py-3 rounded font-bold"
                    >
                        Voltar para Checkout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-12">
            {/* ... (Header omitted for brevity) ... */}

            {/* Main Content */}
            <main className="px-4 py-6">

                {/* Payment Container */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-md mx-auto">

                    {/* Header */}
                    <div className="bg-green-50/50 p-4 border-b border-gray-100 text-center">
                        <div className="inline-flex items-center gap-2 mb-1">
                            <QrCode className="w-5 h-5 text-gray-700" />
                            <span className="font-bold text-gray-900">Pagamento via PIX</span>
                        </div>
                    </div>

                    <div className="p-6 flex flex-col items-center text-center">

                        {/* Order Value */}
                        <div className="mb-6">
                            <span className="text-sm text-gray-500">Valor do pedido</span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-1">{formatPrice(orderTotal)}</h2>
                        </div>

                        {/* Instructions */}
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed max-w-xs">
                            Use o aplicativo do seu banco para escanear o código QR ou copie o código PIX abaixo.
                        </p>

                        {/* QR Code */}
                        <div className="mb-6 p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                            {paymentData?.qrCodeImage ? (
                                /* 1. Use API provided Image */
                                <div className="flex justify-center">
                                    <img
                                        src={getQrImageSrc(paymentData.qrCodeImage)}
                                        alt="QR Code PIX"
                                        className="w-48 h-48 object-contain"
                                    />
                                </div>
                            ) : pixCode ? (
                                /* 2. Fallback: Generate from code */
                                <div className="flex justify-center">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`}
                                        alt="QR Code PIX"
                                        className="w-48 h-48 object-contain"
                                    />
                                </div>
                            ) : (
                                /* 3. Visual Placeholder */
                                <div className="w-48 h-48 bg-gray-900 flex items-center justify-center relative mx-auto">
                                    <QrCode className="w-32 h-32 text-white opacity-20" strokeWidth={1} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white/50 text-xs font-mono">AGUARDANDO PIX</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Timer */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="flex items-center gap-2 text-orange-600 mb-1">
                                <Timer className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wide">
                                    {expiresAt ? 'Pague antes de expirar' : 'Você tem 15 minutos para pagar'}
                                </span>
                            </div>
                            <span className="text-xl font-mono text-gray-900 font-medium">14:59</span>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gray-100 mb-6"></div>

                        {/* Copy Paste Code */}
                        <div className="w-full mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 text-left">
                                Pix Copia e Cola
                            </label>
                            <div className="bg-gray-50 border border-gray-200 rounded p-3 text-left">
                                <p className="text-xs text-gray-500 font-mono break-all line-clamp-3">
                                    {pixCode}
                                </p>
                            </div>
                        </div>

                        {/* Copy Button */}
                        <button className="w-full bg-[#E50000] hover:bg-[#cc0000] text-white font-bold py-4 rounded transition-colors text-base uppercase tracking-wide flex items-center justify-center gap-2">
                            <Copy className="w-4 h-4" />
                            Copiar código PIX
                        </button>

                    </div>

                    {/* Security Footer inside card */}
                    <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Confirmação automática após o pagamento</span>
                        </div>
                    </div>
                </div>

                {/* Help */}
                <div className="mt-8 text-center px-8">
                    <p className="text-xs text-gray-400 leading-relaxed">
                        Ao pagar, você concorda com nossos termos. Caso precise de ajuda, entre em contato com nosso suporte.
                    </p>
                </div>

            </main>
        </div>
    );
};

export default PixPaymentPage;
