import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { MapPin, ShoppingBag, Menu, Search, X } from 'lucide-react';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
    const { totalItems, openCart } = useCart();

    // States
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCepOpen, setIsCepOpen] = useState(false);
    const [cepValue, setCepValue] = useState("");
    const [cepMessage, setCepMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleCep = () => {
        setIsCepOpen(!isCepOpen);
        if (!isCepOpen) {
            setCepMessage(null);
            setCepValue("");
        }
    };

    const handleCepValidation = () => {
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
        setIsMenuOpen(false);
    };

    const handleMenuClick = (path: string) => {
        // Simple navigation handler
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className="relative w-full bg-white z-40 font-sans">
                {/* --- TOP BAR --- */}
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4 lg:px-6">
                    {/* Left: Menu Button */}
                    <div className="flex-1 flex justify-start">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 hover:bg-gray-100 transition-colors focus:outline-none"
                            aria-label="Abrir menu"
                        >
                            <Menu className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex-1 flex justify-center">
                        <a href="/" onClick={handleHomeClick} className="hover:opacity-80 transition-opacity">
                            <img src={logo} alt="Havaianas" className="h-[22px]" />
                        </a>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex-1 flex justify-end items-center gap-1">
                        {/* CEP Selector */}
                        <div className="relative">
                            <button
                                onClick={toggleCep}
                                className={`p-2 hover:bg-gray-100 transition-colors focus:outline-none ${isCepOpen ? 'bg-gray-100' : ''}`}
                                title="Selecionar localização"
                            >
                                <MapPin className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
                            </button>

                            {/* CEP Popover (Square) */}
                            {isCepOpen && (
                                <div className="absolute right-0 top-12 w-72 bg-white shadow-xl border border-gray-200 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Sua Localização</span>
                                            <button onClick={() => setIsCepOpen(false)} className="text-gray-400 hover:text-red-600">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="flex gap-0 border border-gray-300 focus-within:border-gray-900 transition-colors">
                                            <input
                                                type="text"
                                                value={cepValue}
                                                onChange={(e) => setCepValue(e.target.value)}
                                                placeholder="00000-000"
                                                className="flex-1 px-3 py-2 text-sm outline-none placeholder:text-gray-400"
                                                onKeyDown={(e) => e.key === 'Enter' && handleCepValidation()}
                                                autoFocus
                                            />
                                            <button
                                                onClick={handleCepValidation}
                                                className="bg-gray-900 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-red-600 transition-colors"
                                            >
                                                OK
                                            </button>
                                        </div>
                                        {cepMessage && (
                                            <span className={`text-xs font-medium ${cepMessage.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
                                                {cepMessage}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart Button */}
                        <button
                            onClick={openCart}
                            className="relative p-2 hover:bg-gray-100 transition-colors group"
                        >
                            <ShoppingBag className="w-6 h-6 text-gray-800 group-hover:text-black" strokeWidth={1.5} />
                            {totalItems > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* --- BOTTOM BAR: SEARCH --- */}
                <div className="w-full bg-gray-50 border-b border-gray-200 py-3 px-4 lg:px-6">
                    <div className="max-w-screen-xl mx-auto flex items-center gap-3">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    handleMenuClick(`/search?q=${encodeURIComponent(searchQuery)}`);
                                }
                            }}
                            placeholder="O que você procura?"
                            className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 font-medium"
                        />
                    </div>
                </div>
            </header>

            {/* --- DRAWER MENU --- */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 animate-in fade-in duration-300"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Panel */}
                    <div className="relative w-[80%] max-w-[300px] bg-white h-full shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
                        {/* Drawer Header - New Design */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Navegação</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 -mr-2 text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <X className="w-6 h-6" strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Drawer Links - Curated List */}
                        <nav className="flex-1 px-8 py-8">
                            <ul className="flex flex-col gap-6">
                                <li>
                                    <button
                                        onClick={() => handleMenuClick('/categoria/lancamentos')}
                                        className="text-[15px] font-medium text-gray-800 hover:text-red-600 transition-colors block w-full text-left"
                                    >
                                        Lançamentos
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleMenuClick('/categoria/masculino')}
                                        className="text-[15px] font-medium text-gray-800 hover:text-red-600 transition-colors block w-full text-left"
                                    >
                                        Masculino
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleMenuClick('/categoria/feminino')}
                                        className="text-[15px] font-medium text-gray-800 hover:text-red-600 transition-colors block w-full text-left"
                                    >
                                        Feminino
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleMenuClick('/categoria/outlet')}
                                        className="text-[15px] font-medium text-red-600 hover:text-red-700 transition-colors block w-full text-left"
                                    >
                                        Outlet
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleMenuClick('/categoria/iconicos')}
                                        className="text-[15px] font-medium text-gray-800 hover:text-red-600 transition-colors block w-full text-left"
                                    >
                                        Destaques
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
