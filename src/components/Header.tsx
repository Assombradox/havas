import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Menu, MapPin, ShoppingBag, X, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
    const { totalItems, openCart } = useCart();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCepOpen, setIsCepOpen] = useState(false);
    const [cepValue, setCepValue] = useState("");
    const [cepMessage, setCepMessage] = useState<string | null>(null);

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
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

    const menuItems = [
        "Mulher", "Homem", "Kids", "Acessórios", "Outlet", "Rastrear pedido"
    ];

    return (
        <header className="relative w-full h-16 bg-white border-b border-gray-100 shadow-sm font-sans flex items-center justify-between px-4 lg:px-8 z-50">
            {/* Left: Hamburger Menu */}
            <div className="flex-1 flex justify-start">
                <button
                    onClick={toggleDrawer}
                    className="p-2 hover:bg-gray-50 rounded-full transition-colors focus:outline-none"
                    aria-label="Menu"
                >
                    <Menu className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                </button>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
                <a href="#" className="hover:opacity-80 transition-opacity">
                    <img src={logo} alt="Havaianas" className="h-[26px] mt-1" />
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

            {/* Drawer Overlay */}
            {isDrawerOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
                        onClick={toggleDrawer}
                    />
                    <div className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col">
                        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                            <span className="font-serif font-bold text-lg">MENU</span>
                            <button
                                onClick={toggleDrawer}
                                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto py-4">
                            <ul className="flex flex-col">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <a
                                            href="#"
                                            className="flex items-center justify-between px-6 py-4 text-gray-800 hover:bg-gray-50 transition-colors text-sm font-medium tracking-wide border-b border-gray-50"
                                        >
                                            {item}
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="p-6 bg-gray-50">
                            <p className="text-xs text-center text-gray-400">© 2025 Store Inc.</p>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;
