import React, { useEffect, useState } from 'react';
import { optimizeImage } from '../utils/imageOptimization';
import { bannersAdminService } from '../admin/services/bannersAdminService';
import { BannerLocation, type Banner } from '../types/Banner';
const BANNER_URL = 'https://res.cloudinary.com/ddcjebuni/image/upload/v1770453613/banner-simples_ctg6xp.webp';

const EditorialBanner: React.FC = () => {
    const [banner, setBanner] = useState<Banner | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await bannersAdminService.getPublic(BannerLocation.EDITORIAL);
                if (data.length > 0) {
                    setBanner(data[0]); // Take the first one by order
                }
            } catch (error) {
                console.error('Failed to load editorial banner');
            }
        };
        load();
    }, []);

    // If loading, show nothing or skeleton. If no banner, fall back to hardcoded default for now
    // or just don't render. User instruction says: "Exiba o primeiro banner ativo encontrado."

    // Default Fallback logic (optional but keeps UI stable if database empty)
    const imageSrc = banner?.imageUrl || BANNER_URL;
    const link = banner?.link;

    return (
        <section className="w-full py-6 bg-white flex justify-center">
            <div className="w-full max-w-[1200px] px-4">
                {link ? (
                    <a href={link} className="block transition-transform hover:scale-[1.01] duration-300">
                        <img
                            src={optimizeImage(imageSrc, 1200)}
                            alt={banner?.title || "Havaianas Editorial"}
                            width="1200"
                            height="400"
                            loading="eager"
                            fetchPriority="high"
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </a>
                ) : (
                    <img
                        src={optimizeImage(imageSrc, 1200)}
                        alt={banner?.title || "Havaianas Editorial"}
                        width="1200"
                        height="400"
                        loading="eager"
                        fetchPriority="high"
                        className="w-full h-auto object-cover rounded-lg"
                    />
                )}
            </div>
        </section>
    );
};

export default EditorialBanner;
