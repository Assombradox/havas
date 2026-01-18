import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const DeliveryAvailabilityBar: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [location, setLocation] = useState('todo o Brasil');

    useEffect(() => {
        const isClosed = sessionStorage.getItem('deliveryBarClosed');
        if (isClosed === 'true') {
            setIsVisible(false);
        }

        // Fetch user location based on IP
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.city && data.region_code) {
                    setLocation(`${data.city}, ${data.region_code}`);
                }
            })
            .catch(err => {
                console.error("Erro ao buscar local:", err);
                // Keep default "todo o Brasil"
            });
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('deliveryBarClosed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="w-full h-10 bg-[#347545] flex items-center justify-center relative px-4">
            <span className="text-white text-sm font-normal text-center">
                Exibindo produtos disponíveis para entrega em {location}
            </span>
            <button
                onClick={handleClose}
                className="absolute right-4 p-1 hover:bg-[#2c6239] rounded-full transition-colors text-white"
                aria-label="Fechar aviso de entrega"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default DeliveryAvailabilityBar;
