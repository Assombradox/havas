import React, { useState } from 'react';
import { ArrowRight, Check, Truck, ShoppingBag } from 'lucide-react';

// --- STYLES (Injected for simplicity, matching original) ---
const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Nunito:wght@400;700;900&display=swap');

  .font-display { font-family: 'Unbounded', sans-serif; }
  .font-body { font-family: 'Nunito', sans-serif; }

  .glass-panel {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
  }

  .wheel-container {
      position: relative;
      width: 300px;
      height: 300px;
      margin: 0 auto;
      transition: transform 4s cubic-bezier(0.25, 1, 0.5, 1);
      filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.25));
      transform-style: preserve-3d;
  }

  .wheel {
      width: 100%;
      height: 100%;
      position: relative;
      transform: rotate(0deg);
  }

  @keyframes pulse-logo {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
  }

  @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
  }

  .confetti {
      position: absolute;
      width: 10px;
      height: 10px;
      background-color: #ec4c33;
      animation: confetti-fall 3s linear infinite;
  }

  @keyframes confetti-fall {
      0% { transform: translateY(-10vh) rotate(0deg); }
      100% { transform: translateY(110vh) rotate(720deg); }
  }

  .truck-drive-in {
      width: 150px;
      animation: driveInFromLeft 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      opacity: 0;
      transform: translateX(-200%);
  }

  @keyframes driveInFromLeft {
      0% { transform: translateX(-200%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
  }
`;

// --- DATA ---
const QUESTIONS = [
    {
        id: 'gender',
        text: "Primeiro, conta pra gente: qual coleção faz mais seu estilo?",
        options: [
            { label: "Linha Masculina", icon: "👨", val: "masculino" },
            { label: "Linha Feminina", icon: "👩", val: "feminino" },
            { label: "Sem Gênero / Unissex", icon: "🌈", val: "neutral" }
        ]
    },
    {
        id: 'location',
        text: "Onde você pretende passar a maior parte da folia?",
        options: [
            { label: "Bloco de Rua", icon: "🥁", val: "rua" },
            { label: "Pé na Areia", icon: "🏖️", val: "praia" },
            { label: "Churrasco em Casa", icon: "🏠", val: "casa" }
        ]
    },
    {
        id: 'vibe',
        text: "Qual vai ser a intensidade do rolê?",
        options: [
            { label: "Inimigo do Fim", icon: "⚡", val: "festa" },
            { label: "Socialzinha", icon: "🍻", val: "social" },
            { label: "Modo Descanso", icon: "💤", val: "relax" }
        ]
    },
    {
        id: 'style',
        text: "E pra fechar: o que não pode faltar no look?",
        options: [
            { label: "Muito Brilho", icon: "✨", val: "glitter" },
            { label: "Fantasia Completa", icon: "🎭", val: "fantasia" },
            { label: "Conforto Total", icon: "☁️", val: "conforto" }
        ]
    }
];

const QuizPage: React.FC = () => {
    // State
    const [view, setView] = useState<'intro' | 'quiz' | 'transition' | 'game'>('intro');
    const [qIndex, setQIndex] = useState(0);
    const [userData, setUserData] = useState<any>({ gender: 'neutral' });
    const [spins, setSpins] = useState(3);
    const [rotation, setRotation] = useState(0);
    const [modal, setModal] = useState<'none' | 'tryAgain' | 'freeShipping' | 'winner'>('none');
    const [countdown, setCountdown] = useState("59:00");
    const [confetti, setConfetti] = useState<boolean>(false);

    // --- LOGIC ---

    const handleAnswer = (key: string, val: string) => {
        setUserData((prev: any) => ({ ...prev, [key]: val }));

        if (qIndex < QUESTIONS.length - 1) {
            setQIndex(prev => prev + 1);
        } else {
            // Finish Quiz
            localStorage.setItem('carnival_data', JSON.stringify({ ...userData, [key]: val }));
            setView('transition');

            setTimeout(() => {
                setView('game');
            }, 2500); // Wait for transition animation
        }
    };

    const spinWheel = () => {
        if (spins <= 0) return;

        const currentSpins = spins - 1;
        setSpins(currentSpins);

        let targetIndex = 0;
        let resultType = '';

        if (currentSpins === 2) {
            targetIndex = 5; // Try Again (Purple)
            resultType = 'loss';
        } else if (currentSpins === 1) {
            targetIndex = 0; // Free Shipping (Red)
            resultType = 'free_shipping';
        } else {
            targetIndex = 2; // Win (Yellow)
            resultType = 'win';
        }

        // Math
        const extraSpins = 5 * 360;
        const angleToTarget = 360 - (targetIndex * 60);
        const finalRot = rotation + extraSpins + (angleToTarget - (rotation % 360));

        setRotation(finalRot);

        setTimeout(() => {
            handleResult(resultType);
        }, 4100);
    };

    const handleResult = (type: string) => {
        if (type === 'loss') setModal('tryAgain');
        else if (type === 'free_shipping') setModal('freeShipping');
        else if (type === 'win') {
            setModal('winner');
            setConfetti(true);
            startCountdown();
        }
    };

    const startCountdown = () => {
        let duration = 59 * 60;
        const interval = setInterval(() => {
            let m = Math.floor(duration / 60);
            let s = duration % 60;
            setCountdown(`${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`);
            if (--duration < 0) clearInterval(interval);
        }, 1000);
    };

    const goToStore = () => {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('coupon', 'DESCONTO60');
        currentParams.set('gender', userData.gender);

        if (!currentParams.has('utm_source')) currentParams.set('utm_source', 'quiz_carnaval');
        if (!currentParams.has('utm_medium')) currentParams.set('utm_medium', 'promo_page');
        if (!currentParams.has('utm_campaign')) currentParams.set('utm_campaign', 'summer_2026');

        window.location.href = window.location.origin + "/?" + currentParams.toString();
    };

    // --- RENDERERS ---

    const renderConfetti = () => {
        if (!confetti) return null;
        const pieces = Array.from({ length: 50 }).map((_, i) => (
            <div
                key={i}
                className="confetti"
                style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: ['#ec4c33', '#4ade80', '#00a7bb', '#fcd34d'][Math.floor(Math.random() * 4)],
                    animationDelay: `${Math.random() * 2}s`
                }}
            />
        ));
        return <div className="absolute inset-0 pointer-events-none z-0">{pieces}</div>;
    };

    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden text-gray-900 font-body bg-gray-100">
            <style>{pageStyles}</style>

            {/* Background Texture */}
            <div className="fixed inset-0 z-0 opacity-50 pointer-events-none"
                style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%239C92AC\\' fill-opacity=\\'0.05\\' fill-rule=\\'evenodd\\'%3E%3Cpath d=\\'M0 40L40 0H20L0 20M40 40V20L20 40\\'/%3E%3C/g%3E%3C/svg%3E')" }}>
            </div>

            <main className="flex-grow flex flex-col items-center justify-center p-4 w-full max-w-md mx-auto relative z-10 h-screen">

                {/* INTRO VIEW */}
                {view === 'intro' && (
                    <div className="glass-panel w-full rounded-[2rem] p-8 shadow-2xl text-center flex flex-col items-center justify-between min-h-[500px] animate-fade-in-up border border-white/50">
                        <div className="w-full flex justify-center mb-8">
                            <h1 className="text-3xl font-black text-[#ec4c33] tracking-tighter mix-blend-multiply font-display">havaianas</h1>
                        </div>

                        <div className="flex-grow flex flex-col justify-center items-center gap-6">
                            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg rotate-3 group hover:rotate-6 transition-transform duration-500">
                                <img src="https://res.cloudinary.com/ddcjebuni/image/upload/f_auto,q_auto/v1770190111/intro-bg_fqupfq.png"
                                    alt="Carnaval" className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="font-display text-4xl font-black leading-none text-gray-900">CENSO DA<br />FOLIA 2026</h2>
                                <p className="text-gray-500 font-medium text-sm max-w-[200px] mx-auto">Responda 4 perguntas rápidas e desbloqueie prêmios exclusivos.</p>
                            </div>
                        </div>

                        <button onClick={() => setView('quiz')}
                            className="btn-primary w-full bg-gray-900 text-white font-bold py-5 rounded-full text-lg mt-8 flex items-center justify-center gap-2 group hover:shadow-xl hover:-translate-y-1 transition-all">
                            COMEÇAR AGORA
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {/* QUIZ VIEW */}
                {view === 'quiz' && (
                    <div className="w-full h-full flex flex-col">
                        <div className="relative w-full aspect-[16/10] rounded-[2rem] overflow-hidden shadow-lg mb-6 flex-shrink-0 animate-fade-in-up">
                            <img
                                src={qIndex === 0 ? "https://res.cloudinary.com/ddcjebuni/image/upload/f_auto,q_auto/v1770190117/quiz-header-genero_c41hkk.jpg" : "https://res.cloudinary.com/ddcjebuni/image/upload/f_auto,q_auto/v1770190112/quiz-header-atmosfera_m8qbes.jpg"}
                                alt="Quiz Context" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-6 text-white">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Pergunta <span>{qIndex + 1}</span>/4</p>
                                <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-white transition-all duration-300" style={{ width: `${((qIndex + 1) / 4) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow flex flex-col px-2 animate-fade-in-up key={qIndex}">
                            <h2 className="font-display text-2xl font-black text-gray-900 mb-6 leading-tight">{QUESTIONS[qIndex].text}</h2>
                            <div className="flex flex-col gap-3">
                                {QUESTIONS[qIndex].options.map((opt, idx) => (
                                    <button key={idx} onClick={() => handleAnswer(QUESTIONS[qIndex].id, opt.val)}
                                        className="w-full text-left p-4 rounded-xl border-2 border-transparent bg-white shadow-sm hover:border-gray-900 transition-all duration-200 flex items-center gap-4 group animate-fade-in-up"
                                        style={{ animationDelay: `${idx * 0.1}s` }}>
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl group-hover:bg-gray-900 group-hover:text-white transition-colors">
                                            {opt.icon}
                                        </div>
                                        <span className="font-bold text-gray-700 group-hover:text-gray-900 text-lg">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TRANSITION VIEW */}
                {view === 'transition' && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center">
                        <h1 className="text-4xl font-black text-[#ec4c33] animate-[pulse-logo_1s_infinite] font-display">havaianas</h1>
                        <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Processando Vibe...</p>
                    </div>
                )}

                {/* GAME VIEW */}
                {view === 'game' && (
                    <div className="w-full flex flex-col items-center justify-center animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="font-display text-3xl font-black text-gray-900">Obrigado por participar!</h2>
                            <p className="text-gray-500 text-sm mt-1">Gire para descobrir seu benefício</p>
                        </div>

                        <div className="relative mb-10">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-[60px]">
                                <img src="https://res.cloudinary.com/ddcjebuni/image/upload/f_auto,q_auto/v1770190112/pino-visual_yd66gg.png"
                                    alt="Indicator" className="w-full drop-shadow-md" />
                            </div>
                            <div className="wheel-container" style={{ transform: `rotate(${rotation}deg)` }}>
                                <div className="wheel flex items-center justify-center">
                                    <img src="https://res.cloudinary.com/ddcjebuni/image/upload/f_auto,q_auto/v1770190118/roleta-visual_o72blo.png"
                                        alt="Roleta" className="w-full h-full object-contain" />
                                </div>
                            </div>
                        </div>

                        <button onClick={spinWheel} disabled={spins === 0}
                            className={`btn-primary bg-[#ec4c33] text-white font-black py-4 px-12 rounded-full text-xl shadow-lg shadow-orange-200 w-full max-w-xs ${spins === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            GIRAR ROLETA
                        </button>
                        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Tentativas: <span>{spins}</span></p>
                    </div>
                )}

                {/* MODALS */}
                {modal === 'tryAgain' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
                        <div className="bg-white rounded-3xl p-8 max-w-xs text-center shadow-2xl mx-4 relative">
                            <div className="mb-4 text-4xl">😅</div>
                            <h3 className="font-display text-2xl font-black text-gray-900 mb-2">Quase lá!</h3>
                            <p className="text-gray-500 text-sm mb-6">A sorte está girando. Você tem mais uma chance de ganhar!</p>
                            <button onClick={() => setModal('none')} className="btn-primary w-full bg-gray-900 text-white font-bold py-3 rounded-full">
                                GIRAR NOVAMENTE
                            </button>
                        </div>
                    </div>
                )}

                {modal === 'freeShipping' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
                        <div className="bg-white rounded-3xl p-8 max-w-xs text-center shadow-2xl mx-4 relative overflow-hidden">
                            <div className="w-full flex justify-center mb-6">
                                <img src="https://res.cloudinary.com/ddcjebuni/image/upload/f_auto,q_auto/v1770190111/caminhao-frete_e0arqq.png"
                                    alt="Caminhão Frete" className="truck-drive-in" />
                            </div>
                            <h3 className="font-display text-2xl font-black text-gray-900 mb-2 leading-none">AÊÊ!<br />FRETE GRÁTIS! 🚚💨</h3>
                            <p className="text-gray-500 text-sm mb-6">Já é seu! Mas calma que tem coisa MELHOR te esperando no último giro.</p>
                            <button onClick={() => setModal('none')} className="btn-primary w-full bg-[#00a7bb] text-white font-bold py-4 rounded-full shadow-lg shadow-cyan-200">
                                GIRAR A ÚLTIMA VEZ!
                            </button>
                        </div>
                    </div>
                )}

                {modal === 'winner' && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                        <div className="bg-white w-full sm:max-w-md p-0 sm:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl relative overflow-hidden animate-slide-up">
                            {renderConfetti()}

                            <div className="relative z-10">
                                <div className="w-full h-64 bg-gray-100 relative">
                                    <img src="https://res.cloudinary.com/ddcjebuni/image/upload/f_auto,q_auto/v1770190112/premio-final_w3zimz.jpg"
                                        alt="Prêmio Final" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                                        <div className="text-white">
                                            <p className="font-bold text-sm uppercase tracking-wider opacity-90">Prêmio Máximo Desbloqueado</p>
                                            <h2 className="font-display text-4xl font-black">60% OFF +</h2>
                                            <h2 className="font-display text-4xl font-black">Frete Grátis</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-white">
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                <Check className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">Cupom Aplicado</h3>
                                                <p className="text-sm text-gray-500">Toda a loja com 60% OFF</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <Truck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">Frete Grátis</h3>
                                                <p className="text-sm text-gray-500">Para todo Brasil</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={goToStore}
                                        className="btn-primary w-full bg-black text-white font-black py-4 rounded-xl text-lg flex justify-center items-center gap-2 shadow-xl hover:bg-gray-800 transition-colors">
                                        RESGATAR AGORA
                                        <ShoppingBag className="w-5 h-5" />
                                    </button>
                                    <p className="text-center mt-3 text-xs text-gray-400 font-medium">Oferta expira em <span className="font-bold text-[#ec4c33]">{countdown}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default QuizPage;
