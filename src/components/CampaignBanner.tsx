import { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CampaignBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        // 1. Initial Check
        const checkCampaign = () => {
            const searchParams = new URLSearchParams(window.location.search);
            const hasCoupon = searchParams.get('coupon') === 'DESCONTO60';
            const STORAGE_KEY = 'promo_timer_target';

            // If query param is present, initiate or update campaign
            if (hasCoupon) {
                // Check if we already have a running timer active?
                // Actually, if they visit again with the link, we might want to reset or keep it?
                // Usually landing pages want to enforce "15 mins left" whenever you arrive, 
                // OR persist the original session.
                // Let's persist existing session if valid, otherwise start new.
                const existing = localStorage.getItem(STORAGE_KEY);
                if (!existing || parseInt(existing) < Date.now()) {
                    const newTarget = Date.now() + 59 * 60 * 1000; // 59 mins
                    localStorage.setItem(STORAGE_KEY, newTarget.toString());
                }
            }

            const targetTime = localStorage.getItem(STORAGE_KEY);
            if (targetTime) {
                const msRemaining = parseInt(targetTime) - Date.now();
                if (msRemaining > 0) {
                    setTimeLeft(Math.floor(msRemaining / 1000));
                    setIsVisible(true);
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                    setIsVisible(false);
                }
            }
        };

        checkCampaign();
        // Optional: Listen to window focus or navigation if needed, 
        // but mount is usually enough for SPA initial load.
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const tick = () => {
            const STORAGE_KEY = 'promo_timer_target';
            const targetTime = localStorage.getItem(STORAGE_KEY);

            if (!targetTime) return;

            const now = Date.now();
            const end = parseInt(targetTime);
            const secondsRemaining = Math.floor((end - now) / 1000);

            if (secondsRemaining <= 0) {
                setIsVisible(false);
                localStorage.removeItem(STORAGE_KEY);
                setTimeLeft(0);
            } else {
                setTimeLeft(secondsRemaining);
            }
        };

        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [isVisible]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleClose = () => {
        setIsVisible(false);
        // Decision: Close button hides it but keeps timer running in background
        // (doesn't clear localStorage).
    };

    return (
        <>
            {/* 
              SPACER: Prevents layout shift. 
              Only renders when visible. Matches the 48px (h-12) of the fixed banner.
            */}
            {isVisible && <div className="w-full h-12" aria-hidden="true" />}

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="fixed top-0 left-0 w-full z-50 bg-[#dc2626] text-white shadow-2xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(90deg, #ec4c33 0%, #ff8c00 100%)',
                            boxShadow: '0 4px 20px rgba(236, 76, 51, 0.4)'
                        }}
                    >
                        <div className="container mx-auto px-4 h-12 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-full animate-pulse">
                                    <Clock className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex flex-col leading-tight sm:flex-row sm:gap-2 sm:items-center">
                                    <span className="font-extrabold text-sm tracking-wide uppercase">Oferta Secreta!</span>
                                    <span className="text-xs sm:text-sm text-red-50 hidden sm:inline-block">Use cupom <span className="font-black text-white bg-white/20 px-1.5 py-0.5 rounded ml-1">DESCONTO60</span></span>
                                    {/* Mobile-only compact view */}
                                    <span className="text-xs sm:hidden font-bold text-white/90">Cupom: DESCONTO60</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                                    <span className="text-[10px] uppercase font-bold text-red-100 tracking-wider hidden sm:inline">Expira:</span>
                                    <span className="font-mono text-sm font-black text-white tabular-nums w-[4ch] text-center">
                                        {formatTime(timeLeft)}
                                    </span>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors active:scale-95"
                                    aria-label="Fechar banner"
                                >
                                    <X className="w-4 h-4 text-white/90" />
                                </button>
                            </div>
                        </div>

                        {/* Progress Indication */}
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black/20">
                            <motion.div
                                className="h-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.7)]"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: timeLeft, ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
