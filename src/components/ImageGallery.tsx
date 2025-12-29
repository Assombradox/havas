import React, { useState, useRef, useEffect } from 'react';

interface ImageGalleryProps {
    images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Update current index on scroll
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollPosition = container.scrollLeft;
            const width = container.offsetWidth;
            const index = Math.round(scrollPosition / width);
            setCurrentIndex(index);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <section className="w-full bg-white relative">
            {/* Swipeable Container */}
            <div
                ref={scrollContainerRef}
                className="w-full overflow-x-auto flex snap-x snap-mandatory scrollbar-hide"
            >
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="w-full flex-none snap-center flex items-center justify-center bg-gray-50"
                    >
                        {/* 
                           No fixed aspect ratio forced on container wrapper. 
                           Image uses object-contain to preserve natural proportions.
                           A min-height is useful to prevent collapse if image is missing, 
                           but we rely on content. We add a specialized container height 
                           often found in mobile PDPs, but 'h-auto' allows natural height.
                           However, for a smooth swipe, consistent height is often preferred. 
                           User asked to preserve natural proportions using object-contain.
                           We'll set a max-height to ensure it fits mobile screens well 
                           but allow width to be 100%. 
                        */}
                        <div className="w-full relative flex items-center justify-center">
                            <img
                                src={image}
                                alt={`Product view ${index + 1}`}
                                className="w-full object-contain"
                                loading={index === 0 ? "eager" : "lazy"}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Indicator */}
            {/* Positioned below the image, centered, styled as UI element */}
            <div className="flex justify-center py-4 bg-white">
                <div className="bg-gray-100 rounded-full px-3 py-1">
                    <span className="text-xs font-medium text-gray-500">
                        {currentIndex + 1} / {images.length}
                    </span>
                </div>
            </div>
        </section>
    );
};

export default ImageGallery;
