import { useState, useEffect } from 'react';

const AnnouncementBar: React.FC = () => {
    const messages = [
        "FRETE A PARTIR DE R$ 7,99 PARA TODO BRASIL",
        "PARCELAMENTO EM ATÉ 6X SEM JUROS",
        "ENVIAMOS PARA TODO O BRASIL"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            // Start fade out
            setIsVisible(false);

            // Change text after fade out completes (500ms)
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % messages.length);
                setIsVisible(true); // Fade in
            }, 500);

        }, 3500); // Change every 3.5s

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-[#0047FF] h-10 flex items-center justify-center overflow-hidden px-4">
            <span
                className={`text-white text-sm font-bold tracking-wide transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                {messages[currentIndex]}
            </span>
        </div>
    );
};

export default AnnouncementBar;
