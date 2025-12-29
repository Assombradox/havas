import React from 'react';
import logo from '../../assets/logo.png';

const CheckoutHeader: React.FC = () => {
    return (
        <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-center px-4">
            <img src={logo} alt="Havaianas" className="h-[26px]" />
        </header>
    );
};

export default CheckoutHeader;
