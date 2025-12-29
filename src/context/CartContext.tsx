import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

export interface CartItem {
    id: string; // Changed to string to support composite IDs or UUIDs
    name: string;
    image: string;
    color: string;
    size: string;
    unitPrice: number;
    discountedPrice?: number;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    isCartOpen: boolean;
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    totalItems: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const savedCart = localStorage.getItem('shopping-cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('shopping-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
        setCartItems((prevItems) => {
            // Check if item already exists (same id, color, size)
            // Ideally ID should be unique per variant, but relying on composite checks is safer if ID is generic product ID
            // For this implementation, we will assume 'id' passed in is Unique Variant ID or we check variant props
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === newItem.id && item.color === newItem.color && item.size === newItem.size
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            } else {
                return [...prevItems, { ...newItem, quantity: 1 }];
            }
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (itemId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) return;
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.discountedPrice !== undefined ? item.discountedPrice : item.unitPrice;
        return sum + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isCartOpen,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                openCart,
                closeCart,
                totalItems,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
