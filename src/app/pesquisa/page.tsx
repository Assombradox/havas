import { useState } from 'react';
import { motion } from 'framer-motion';
import MysteryGame from './components/MysteryGame';

export default function PesquisaPage() {
    const [quizStep, setQuizStep] = useState(0); // 0, 1, 2 = Questions, 3 = Game, 4 = Final

    const questions = [
        {
            question: "Qual seu estilo de Havaianas favorito?",
            options: ["Clássicas (Tradicional)", "Slim (Tiras finas)", "Estampadas", "Sandálias Urbanas"]
        },
        {
            question: "Para quem você costuma comprar Havaianas?",
            options: ["Para mim mesmo(a)", "Para presentear", "Para a família toda", "Coleciono!"]
        },
        {
            question: "O que mais valoriza na hora da compra?",
            options: ["Preço Baixo", "Frete Grátis", "Variedade de Modelos", "Conforto"]
        }
    ];

    const handleOptionClick = () => {
        if (quizStep < questions.length - 1) {
            setQuizStep(prev => prev + 1);
        } else {
            setQuizStep(3); // Start Game
        }
    };

    const handleGameComplete = () => {
        setQuizStep(4); // Show Final CTA
    };

    const handleClaimPrize = () => {
        window.location.href = '/?coupon=DESCONTO60';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex flex-col items-center py-10 px-4 font-sans text-gray-800">

            {/* HEADER SIMPLIFICADO */}
            <header className="mb-8 w-full max-w-md text-center">
                <h1 className="text-3xl font-extrabold text-[#e4002b] tracking-tight">Havaianas</h1>
                <p className="text-sm font-medium opacity-70 mt-1">Pesquisa de Satisfação 2026</p>
            </header>

            <main className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px] relative">
                <div className="p-6 md:p-8 h-full flex flex-col">

                    {/* PROGRESS BAR */}
                    {quizStep < 3 && (
                        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
                            <div
                                className="bg-[#e4002b] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((quizStep + 1) / 3) * 100}%` }}
                            />
                        </div>
                    )}

                    {/* QUIZ SECTION */}
                    {quizStep < 3 && (
                        <motion.div
                            key={quizStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col justify-center"
                        >
                            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
                                {questions[quizStep].question}
                            </h2>
                            <div className="space-y-3">
                                {questions[quizStep].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={handleOptionClick}
                                        className="w-full py-4 px-6 bg-gray-50 hover:bg-[#e4002b] hover:text-white border border-gray-200 rounded-xl transition-all duration-200 text-left font-medium active:scale-95 shadow-sm"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* GAME SECTION */}
                    {quizStep === 3 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col justify-center items-center"
                        >
                            <MysteryGame onComplete={handleGameComplete} />
                        </motion.div>
                    )}

                    {/* FINAL CTA SECTION */}
                    {quizStep === 4 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col justify-center items-center text-center space-y-6"
                        >
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 text-4xl">
                                🎉
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Parabéns!</h2>
                                <p className="text-gray-600 mt-2">Você desbloqueou o cupom de <span className="font-bold text-[#e4002b]">60% OFF</span> + Frete Grátis!</p>
                            </div>

                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 w-full mb-4">
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Seu Cupom</p>
                                <code className="text-2xl font-mono font-bold text-[#e4002b]">DESCONTO60</code>
                            </div>

                            <button
                                onClick={handleClaimPrize}
                                className="w-full py-4 bg-[#e4002b] text-white font-bold text-lg rounded-full shadow-lg hover:bg-[#cc0026] active:scale-95 transition-all animate-pulse"
                            >
                                RESGATAR AGORA
                            </button>

                            <p className="text-xs text-gray-400 mt-4">Válido por 15 minutos.</p>
                        </motion.div>
                    )}

                </div>
            </main>

            <footer className="mt-8 text-center text-gray-500 text-xs">
                &copy; 2026 Havaianas. Todos os direitos reservados.
            </footer>
        </div>
    );
}
