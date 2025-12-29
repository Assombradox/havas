import { useState } from 'react';

const AnnouncementBar: React.FC = () => {
    const messages = [
        "FRETE A PARTIR DE R$ 7,99 para Sul e Sudeste",
        "O cupom será aplicado caso o produto atenda aos requisitos."
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [key, setKey] = useState(0); // Used to reset animation

    const handleAnimationEnd = () => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setKey((prev) => prev + 1); // Force re-render relative to animation
    };

    return (
        <div className="w-full bg-[#0047FF] h-10 flex items-center overflow-hidden whitespace-nowrap px-4">
            <div
                key={key}
                className="text-white text-sm font-bold tracking-wide animate-marquee-one-pass"
                onAnimationEnd={handleAnimationEnd}
            >
                {messages[currentIndex]}
            </div>
        </div>
    );
};

export default AnnouncementBar;
