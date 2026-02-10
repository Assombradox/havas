import React, { useState } from 'react';
import CheckoutHeader from '../../components/checkout/CheckoutHeader';
import StepIndicator from '../../components/checkout/StepIndicator';
import OrderSummary from '../../components/checkout/OrderSummary';
import IdentificationStep from './steps/IdentificationStep';
import DeliveryStep from './steps/DeliveryStep';
import PaymentStep from './steps/PaymentStep';
import { CheckoutProvider } from '../../context/CheckoutContext';

// Define step types
export type CheckoutStep = 'identification' | 'delivery' | 'payment';

import { useCart } from '../../context/CartContext'; // Import CartContext

const CheckoutContent: React.FC = () => {
    const { cartItems } = useCart();
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('identification');

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-sm w-full">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Sua sacola está vazia 🛍️</h2>
                    <p className="text-gray-500 mb-6">Adicione produtos antes de finalizar a compra.</p>
                    <button
                        onClick={() => {
                            window.history.pushState({}, '', '/');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                        className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                    >
                        VOLTAR PARA LOJA
                    </button>
                </div>
            </div>
        );
    }

    const handleNext = () => {
        console.log("Transitioning Step. Current URL:", window.location.search);
        if (currentStep === 'identification') setCurrentStep('delivery');
        else if (currentStep === 'delivery') setCurrentStep('payment');
    };

    const handleBack = () => {
        if (currentStep === 'delivery') setCurrentStep('identification');
        else if (currentStep === 'payment') setCurrentStep('delivery');
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 'identification':
                return <IdentificationStep onNext={handleNext} />;
            case 'delivery':
                return <DeliveryStep onNext={handleNext} onBack={handleBack} />;
            case 'payment':
                return <PaymentStep onBack={handleBack} />;
            default:
                return <IdentificationStep onNext={handleNext} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            <CheckoutHeader />
            <StepIndicator currentStep={currentStep} />
            <OrderSummary />

            <main className="w-full max-w-lg mx-auto px-4 py-6">
                {renderStepContent()}
            </main>
        </div>
    );
};

const CheckoutLayout: React.FC = () => {
    return (
        <CheckoutProvider>
            <CheckoutContent />
        </CheckoutProvider>
    );
};

export default CheckoutLayout;
