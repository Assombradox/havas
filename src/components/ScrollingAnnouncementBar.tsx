import React from 'react';

const ScrollingAnnouncementBar: React.FC = () => {
    // Repeated text items to ensure seamless loop
    // We duplicate the content enough times to fill the width + buffer for the scroll
    const items = Array(12).fill(null);

    return (
        <div className="w-full h-10 bg-[#2C5F2D] overflow-hidden flex items-center relative px-4">
            <div className="flex whitespace-nowrap animate-scroll-infinite w-max">
                {items.map((_, index) => (
                    <div key={index} className="flex items-center mx-4">
                        <span className="text-white text-sm font-bold mr-1">pague em até 6x</span>
                        <span className="text-white text-sm font-normal">*parcela mínima de R$49</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScrollingAnnouncementBar;
