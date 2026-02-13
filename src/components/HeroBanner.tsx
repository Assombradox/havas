import React, { useState, useEffect } from 'react';
import { optimizeImage } from '../utils/imageOptimization';
import { bannersAdminService } from '../admin/services/bannersAdminService';
import { BannerLocation } from '../types/Banner';

interface BannerData {
    id: string;
    src: string;
    alt: string;
    link?: string;
}

const SLIDE_DURATION = 5000;


const HeroBanner: React.FC = () => {
    const [banners, setBanners] = useState<BannerData[]>([
        { id: 'static-1', src: "https://res.cloudinary.com/ddcjebuni/image/upload/v1769584180/asset-havaianas-farm-alto-verao-2_q44zfy.gif", alt: "Coleção Farm Alto Verão" },
        { id: 'static-2', src: "https://res.cloudinary.com/ddcjebuni/image/upload/v1769583937/asset_havaianas_banner_ginga_promocao_2_o3a95s.gif", alt: "Promoção Ginga" },
        { id: 'static-3', src: "https://res.cloudinary.com/ddcjebuni/image/upload/v1769583924/asset-havaianas-60_-2_r3isra.gif", alt: "Outlet 60% OFF" },
        { id: 'static-4', src: "https://res.cloudinary.com/ddcjebuni/image/upload/v1769584069/Asset_Hero_Banner_Site_Mobile_2_knnu7z.png", alt: "Ofertas Especiais" },
        { id: 'static-5', src: "https://res.cloudinary.com/ddcjebuni/image/upload/v1769584394/banner_203.gif_t8zxca.webp", alt: "Verão Havaianas" }
    ]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch Banners (Background Update)
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
                }
            } catch (error) {
                console.error("Failed to update hero banners", error);
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
                {banners.map((banner, index) => {
                    const isLCP = index === 0;
                    const isCurrent = index === currentIndex;

                    // Optimization attributes
                    // Index 0 (first slide) is critical for LCP
                    const loadingAttr = isLCP ? "eager" : "lazy";
                    const priorityAttr = isLCP ? "high" : "auto";

                    return (
                        <div
                            key={banner.id}
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isCurrent ? "opacity-100 z-10" : "opacity-0 z-0"
                                }`}
                        >
                            {banner.link ? (
                                <a href={banner.link} className="block w-full h-full">
                                    <img
                                        src={optimizeImage(banner.src, 800)}
                                        alt={banner.alt}
                                        width="800"
                                        height="1088"
                                        loading={loadingAttr}
                                        fetchPriority={priorityAttr}
                                        className="w-full h-full object-cover"
                                    />
                                </a>
                            ) : (
                                <img
                                    src={optimizeImage(banner.src, 1200)}
                                    alt={banner.alt}
                                    width="800"
                                    height="1088"
                                    loading={loadingAttr}
                                    fetchPriority={priorityAttr}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    );
                })}
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
