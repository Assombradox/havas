import React, { useState, useEffect } from 'react';
import { optimizeImage } from '../utils/imageOptimization';
import { bannersAdminService } from '../admin/services/bannersAdminService';
import { BannerLocation } from '../types/Banner';

interface BannerData {
    id: string; // Updated to string
    src: string;
    alt: string;
    link?: string;
}

const SLIDE_DURATION = 5000;

const HeroBanner: React.FC = () => {
    const [banners, setBanners] = useState<BannerData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch Banners
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await bannersAdminService.getPublic(BannerLocation.HERO);
                if (data.length > 0) {
                    setBanners(data.map(b => ({
                        id: b.id,
                        src: b.imageUrl,
                        alt: b.title,
                        link: b.link
                    })));
                } else {
                    // Fallback to legacy static banners if API empty
                    setBanners([
                        { id: '1', src: "/images/banner 1.gif.webp", alt: "Havaianas Clássicas" },
                        { id: '2', src: "/images/banner 2.webp", alt: "Havaianas Nova Coleção" },
                        { id: '3', src: "/images/banner 3.gif.webp", alt: "Havaianas Estilo" },
                        { id: '4', src: "/images/banner 4.webp", alt: "Havaianas Ofertas" }
                    ]);
                }
            } catch (error) {
                console.error("Failed to load hero banners", error);
                // Fallback
                setBanners([
                    { id: '1', src: "/images/banner 1.gif.webp", alt: "Havaianas Clássicas" },
                    { id: '2', src: "/images/banner 2.webp", alt: "Havaianas Nova Coleção" },
                    { id: '3', src: "/images/banner 3.gif.webp", alt: "Havaianas Estilo" },
                    { id: '4', src: "/images/banner 4.webp", alt: "Havaianas Ofertas" }
                ]);
            }
        };
        fetchBanners();
    }, []);

    // Handle slide change
    useEffect(() => {
        if (banners.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, SLIDE_DURATION);

        return () => clearInterval(timer);
    }, [banners.length]);

    if (banners.length === 0) return null;

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
                        {banner.link ? (
                            <a href={banner.link} className="block w-full h-full">
                                <img
                                    src={optimizeImage(banner.src, 1200)}
                                    alt={banner.alt}
                                    width="800"
                                    height="1088"
                                    className="w-full h-full object-cover"
                                />
                            </a>
                        ) : (
                            <img
                                src={optimizeImage(banner.src, 1200)}
                                alt={banner.alt}
                                width="800"
                                height="1088"
                                className="w-full h-full object-cover"
                            />
                        )}
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
