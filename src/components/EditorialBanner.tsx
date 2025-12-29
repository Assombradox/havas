import React from 'react';
import bannerSimples from '../assets/banner-simples.png';

const EditorialBanner: React.FC = () => {
    return (
        <section className="w-full py-6 bg-white flex justify-center">
            <div className="w-full max-w-[1200px] px-4">
                <img
                    src={bannerSimples}
                    alt="Havaianas Editorial"
                    className="w-full h-auto object-cover rounded-lg"
                />
            </div>
        </section>
    );
};

export default EditorialBanner;
