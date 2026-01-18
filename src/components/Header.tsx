import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { MapPin, ShoppingBag } from 'lucide-react';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
    const { totalItems, openCart } = useCart();

    const [isCepOpen, setIsCepOpen] = useState(false);
    const [cepValue, setCepValue] = useState("");
    const [cepMessage, setCepMessage] = useState<string | null>(null);

    const toggleCep = () => {
        setIsCepOpen(!isCepOpen);
        if (!isCepOpen) {
            setCepMessage(null); // Reset message on open
            setCepValue("");
        }
    };

    const handleCepValidation = () => {
        // Simple mock validation
        if (cepValue.length >= 8) {
            setCepMessage("CEP validado com sucesso");
            setTimeout(() => {
                setIsCepOpen(false);
                setCepMessage(null);
            }, 2000);
        } else {
            setCepMessage("CEP inválido");
        }
    };

    const handleHomeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new Event('popstate'));
        window.scrollTo(0, 0);
    };

    return (
        <header className="relative w-full h-16 bg-white border-b border-gray-100 shadow-sm font-sans flex items-center justify-between px-4 lg:px-8 z-50">
            {/* Left: Empty to maintain center alignment of Logo */}
            <div className="flex-1 flex justify-start">
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
                <a href="/" onClick={handleHomeClick} className="hover:opacity-80 transition-opacity">
                    <img src={logo} alt="Havaianas" className="h-[35px] mt-1" />
                </a>
            </div>

            {/* Right: Actions */}
            <div className="flex-1 flex justify-end items-center gap-2">
                {/* CEP Selector */}
                <div className="relative">
                    <button
                        onClick={toggleCep}
                        className="p-2 hover:bg-gray-50 rounded-full transition-colors focus:outline-none"
                        title="Selecionar localização"
                    >
                        <MapPin className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                    </button>

                    {/* CEP Popover */}
                    {isCepOpen && (
                        <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-lg border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Digite seu CEP</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={cepValue}
                                        onChange={(e) => setCepValue(e.target.value)}
                                        placeholder="00000-000"
                                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                        onKeyDown={(e) => e.key === 'Enter' && handleCepValidation()}
                                    />
                                    <button
                                        onClick={handleCepValidation}
                                        className="bg-black text-white px-3 py-1 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        OK
                                    </button>
                                </div>
                                {cepMessage && (
                                    <span className={`text-xs mt-1 ${cepMessage.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
                                        {cepMessage}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Cart */}
                <button
                    onClick={openCart}
                    className="relative p-2 hover:bg-gray-50 rounded-full transition-colors"
                >
                    <ShoppingBag className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                    {totalItems > 0 && (
                        <span className="absolute top-1 right-0 w-4 h-4 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in">
                            {totalItems}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
