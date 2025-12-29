import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface ContactData {
    email: string;
    cpf: string;
    phone: string;
    name: string;
    lastName: string;
}

interface AddressData {
    country: string;
    zip: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    uf: string;
}

interface DeliveryData {
    method: string;
    price: number;
    deadline: string;
}

export interface CheckoutData {
    contact: ContactData;
    address: AddressData;
    delivery: DeliveryData;
}

interface CheckoutContextType {
    checkoutData: CheckoutData;
    updateContact: (data: Partial<ContactData>) => void;
    updateAddress: (data: Partial<AddressData>) => void;
    updateDelivery: (data: Partial<DeliveryData>) => void;
}

const defaultData: CheckoutData = {
    contact: {
        email: '',
        cpf: '',
        phone: '',
        name: '',
        lastName: ''
    },
    address: {
        country: 'Brasil',
        zip: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        uf: ''
    },
    delivery: {
        method: 'Grátis',
        price: 0,
        deadline: '3-5 dias úteis'
    }
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize from localStorage or default
    const [checkoutData, setCheckoutData] = useState<CheckoutData>(() => {
        const saved = localStorage.getItem('checkout_data');
        return saved ? JSON.parse(saved) : defaultData;
    });

    // Save to localStorage on change
    React.useEffect(() => {
        localStorage.setItem('checkout_data', JSON.stringify(checkoutData));
    }, [checkoutData]);

    const updateContact = (data: Partial<ContactData>) => {
        setCheckoutData(prev => ({
            ...prev,
            contact: { ...prev.contact, ...data }
        }));
    };

    const updateAddress = (data: Partial<AddressData>) => {
        setCheckoutData(prev => ({
            ...prev,
            address: { ...prev.address, ...data }
        }));
    };

    const updateDelivery = (data: Partial<DeliveryData>) => {
        setCheckoutData(prev => ({
            ...prev,
            delivery: { ...prev.delivery, ...data }
        }));
    };

    return (
        <CheckoutContext.Provider value={{ checkoutData, updateContact, updateAddress, updateDelivery }}>
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error('useCheckout must be used within a CheckoutProvider');
    }
    return context;
};
