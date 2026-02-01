import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface MysteryGameProps {
    onComplete: () => void;
}

export default function MysteryGame({ onComplete }: MysteryGameProps) {
    const [step, setStep] = useState(0); // 0: Start, 1: First click (fail), 2: Second click (win)

    // Confetti effect
    useEffect(() => {
        if (step === 2) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            // Trigger completion after delay
            setTimeout(() => {
                onComplete();
            }, 1500);
        }
    }, [step, onComplete]);

    const handleBoxClick = () => {
        if (step === 0) {
            setStep(1);
        } else if (step === 1) {
            setStep(2);
        }
    };



    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold text-center mb-8 text-havana-dark">
                {step === 0 && "Escolha uma caixa Surpresa!"}
                {step === 1 && "Tente novamente! Só mais uma chance..."}
                {step === 2 && "PARABÉNS! VOCÊ GANHOU!"}
            </h2>

            <div className="relative w-64 h-64 md:w-80 md:h-80 cursor-pointer" onClick={handleBoxClick}>
                <AnimatePresence mode='wait'>
                    {step === 0 && (
                        <motion.img
                            key="closed"
                            src="/assets/quiz/box-closed.jpg"
                            alt="Closed Box"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                            className="w-full h-full object-contain"
                        />
                    )}

                    {step === 1 && (
                        <motion.img
                            key="empty"
                            src="/assets/quiz/box-empty.jpg"
                            alt="Empty Box"
                            initial={{ x: 0 }}
                            animate={{ x: [0, -10, 10, -10, 10, 0] }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full object-contain"
                        />
                    )}

                    {step === 2 && (
                        <motion.div
                            key="win"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-full h-full relative"
                        >
                            <img
                                src="/assets/quiz/box-win.jpg"
                                alt="Winning Box"
                                className="w-full h-full object-contain"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {step === 1 && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-red-500 font-medium"
                >
                    Caixa vazia! Tente a outra.
                </motion.p>
            )}
        </div>
    );
}
