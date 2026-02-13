import React from 'react';
import { QrCode, Timer, Copy, CheckCircle2, MessageCircle } from 'lucide-react';
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

    // Timer State
    const [timeLeft, setTimeLeft] = React.useState(900); // 15 minutes in seconds

    // Countdown Logic
    React.useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format Time Function (MM:SS)
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Helper: Timer Text Color
    const timerColor = timeLeft < 60 ? 'text-red-600' : 'text-[#e00000]';

    // Fetch Data on Mount
    React.useEffect(() => {
        if (!paymentId) {
            setIsLoading(false);
            return;
        }

        const fetchPaymentDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/pix/${paymentId}`);
                if (!response.ok) throw new Error('Pagamento não encontrado');

                const data = await response.json();
                setPaymentData(data);

                // If backend provides expiration, we could sync timer here
                // For now, we stick to the 15min default starting from render
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
    // const expiresAt = paymentData?.expiresAt; // Use local timer instead

    // Dynamic Total from API (amount is in cents)
    const orderTotal = paymentData?.amount ? paymentData.amount / 100 : 0;

    // Fallback if zero (loading or error)
    const displayTotal = orderTotal > 0 ? orderTotal : 39.90; // Fallback only for legacy dev mode

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
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/pix/status/${paymentId}`);
                const data = await response.json();

                if (data.status === 'paid') {
                    if (data.status === 'paid') {
                        window.location.href = `/checkout/success?id=${paymentId}`;
                    }
                }
            } catch (error) {
                console.error('Erro ao verificar status:', error);
            }
        };

        const interval = setInterval(checkStatus, 3000);
        return () => clearInterval(interval);
    }, [paymentId]);

    // Helper to handle different QR Code formats (URL vs Base64 vs Raw EMV)
    const getQrImageSrc = (source: string) => {
        if (!source) return '';

        // If it looks like a raw EMV string (starts with 0002...), generate QR via API
        if (source.startsWith('0002')) {
            return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(source)}`;
        }

        // Standard checks for ID/URL/Base64
        if (source.startsWith('http') || source.startsWith('data:')) {
            return source;
        }

        // Fallback: assume base64
        return `data:image/png;base64,${source}`;
    };

    const handleCopyPix = () => {
        if (pixCode) {
            navigator.clipboard.writeText(pixCode);
            alert('Código PIX copiado!');
        }
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
                <div className="bg-white p-8 rounded-none shadow-sm border border-red-100 max-w-sm w-full">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Erro</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.href = '/checkout'}
                        className="w-full bg-black text-white py-3 rounded-none font-bold"
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
                <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden max-w-md mx-auto">

                    {/* Header */}
                    <div className="bg-gray-50 p-4 border-b border-gray-100 text-center">
                        <div className="inline-flex items-center gap-2 mb-1">
                            <QrCode className="w-5 h-5 text-gray-700" />
                            <span className="font-bold text-gray-900">Pagamento via PIX</span>
                        </div>
                    </div>

                    <div className="p-6 flex flex-col items-center text-center">

                        {/* Order Value */}
                        <div className="mb-6">
                            <span className="text-sm text-gray-500">Valor do pedido</span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-1">{formatPrice(displayTotal)}</h2>
                        </div>

                        {/* Instructions */}
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed max-w-xs">
                            Use o aplicativo do seu banco para escanear o código QR ou copie o código PIX abaixo.
                        </p>

                        {/* QR Code */}
                        <div className="mb-6 p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                            {paymentData?.qrCodeImage ? (
                                /* 1. Use API provided Image OR Raw logic */
                                <div className="flex justify-center">
                                    <img
                                        src={getQrImageSrc(paymentData.qrCodeImage)}
                                        alt="QR Code PIX"
                                        className="w-48 h-48 object-contain"
                                    />
                                </div>
                            ) : pixCode ? (
                                /* 2. Fallback: Generate from code var if image missing */
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
                            <div className={`flex items-center gap-2 mb-1 ${timerColor}`}>
                                <Timer className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wide">
                                    {timeLeft > 0 ? 'Pague antes de expirar' : 'Código Expirado'}
                                </span>
                            </div>
                            <span className={`text-xl font-mono font-medium ${timerColor}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gray-100 mb-6"></div>

                        {/* Copy Paste Code */}
                        <div className="w-full mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 text-left">
                                Pix Copia e Cola
                            </label>
                            <div className="bg-gray-50 border border-gray-200 rounded-none p-3 text-left">
                                <p className="text-xs text-gray-500 font-mono break-all line-clamp-3">
                                    {pixCode}
                                </p>
                            </div>
                        </div>

                        {/* Copy Button */}
                        <button
                            onClick={handleCopyPix}
                            className="w-full bg-[#E50000] hover:bg-[#cc0000] text-white font-bold py-4 rounded-none transition-colors text-base uppercase tracking-wide flex items-center justify-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            Copiar código PIX
                        </button>

                        {/* WhatsApp Proof CTA */}
                        <div className="mt-8 pt-6 border-t border-gray-100 w-full animate-in slide-in-from-bottom-2">
                            <h3 className="font-bold text-gray-900 text-sm mb-1">
                                Já realizou o pagamento?
                            </h3>
                            <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto leading-relaxed">
                                Envie o comprovante no nosso WhatsApp para agilizar a liberação do seu pedido agora.
                            </p>

                            <a
                                href="https://wa.me/5596991649290?text=Ol%C3%A1%2C%20acabei%20de%20fazer%20o%20pagamento%20do%20meu%20pedido%20via%20PIX%20e%20gostaria%20de%20enviar%20o%20comprovante."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-4 rounded-none transition-colors text-base uppercase tracking-wide flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5 fill-current" />
                                Enviar Comprovante
                            </a>
                        </div>

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
