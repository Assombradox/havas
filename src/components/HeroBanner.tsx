import React, { useState, useEffect } from 'react';

interface BannerData {
    id: number;
    src: string;
    alt: string;
}

// Banners from public/images
const banners: BannerData[] = [
    {
        id: 1,
        src: "/images/banner 1.gif.webp",
        alt: "Havaianas Clássicas"
    },
    {
        id: 2,
        src: "/images/banner 2.webp",
        alt: "Havaianas Nova Coleção"
    },
    {
        id: 3,
        src: "/images/banner 3.gif.webp",
        alt: "Havaianas Estilo"
    },
    {
        id: 4,
        src: "/images/banner 4.webp",
        alt: "Havaianas Ofertas"
    }
];

const SLIDE_DURATION = 5000; // 5 seconds per slide

const HeroBanner: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Handle slide change
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, SLIDE_DURATION);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full flex flex-col items-center py-4 px-4">
            {/* Banner Container */}
            <div className="relative w-full max-w-[400px] aspect-[992/1350] overflow-hidden rounded-lg mx-auto bg-gray-50">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        <img
                            src={banner.src}
                            alt={banner.alt}
                            className="w-full h-full object-cover"
                        // GIFs/WebPs play automatically
                        />


                    </div>
                ))}
            </div>

            {/* Segmented Progress Bar */}
            <div className="flex gap-2 mt-4 w-full max-w-[300px] justify-center">
                {banners.map((_, index) => (
                    <div key={index} className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gray-800 rounded-full origin-left transition-all duration-300 ${index === currentIndex
                                ? "animate-progress-fill"
                                : index < currentIndex
                                    ? "w-full"
                                    : "w-0"
                                }`}
                            style={{
                                animationDuration: `${SLIDE_DURATION}ms`,
                                animationPlayState: index === currentIndex ? 'running' : 'paused'
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeroBanner;
