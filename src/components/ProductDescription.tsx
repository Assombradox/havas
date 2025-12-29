import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProductDescriptionProps {
    description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <section className="w-full bg-[#f7f7f7] mt-6">
            <div className="w-full">
                <button
                    onClick={toggleOpen}
                    className="w-full px-4 py-4 flex items-center justify-between focus:outline-none"
                    aria-expanded={isOpen}
                >
                    <span className="text-sm font-bold text-gray-900">
                        Descrição
                    </span>
                    {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-900 icon-bold" strokeWidth={1.5} />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-900 icon-bold" strokeWidth={1.5} />
                    )}
                </button>

                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="px-4 pb-6">
                        <p className="text-sm font-normal text-[#000000] leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDescription;
