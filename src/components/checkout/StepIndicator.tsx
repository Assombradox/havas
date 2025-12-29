import React from 'react';
import { ChevronRight } from 'lucide-react';

interface StepIndicatorProps {
    currentStep: 'identification' | 'delivery' | 'payment';
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
    const steps = [
        { id: 'identification', label: 'Identificação' },
        { id: 'delivery', label: 'Entrega' },
        { id: 'payment', label: 'Pagamento' }
    ];

    const getStepColor = (stepId: string) => {
        if (currentStep === stepId) return 'text-black font-bold';

        // Logic for completed steps could go here, but for now simple active/inactive
        const stepOrder = ['identification', 'delivery', 'payment'];
        const currentIndex = stepOrder.indexOf(currentStep);
        const stepIndex = stepOrder.indexOf(stepId);

        if (stepIndex < currentIndex) return 'text-green-600 font-medium'; // Completed

        return 'text-gray-400 font-normal';
    };

    return (
        <div className="w-full bg-white py-4 px-4 border-b border-gray-100">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wide">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <span className={getStepColor(step.id)}>
                            {step.label}
                        </span>
                        {index < steps.length - 1 && (
                            <ChevronRight className="w-3 h-3 text-gray-300" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default StepIndicator;
