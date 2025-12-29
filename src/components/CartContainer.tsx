import React from 'react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const CartContainer: React.FC = () => {
    const {
        isCartOpen,
        closeCart,
        cartItems,
        updateQuantity,
        removeFromCart
    } = useCart();

    return (
        <CartDrawer
            isOpen={isCartOpen}
            onClose={closeCart}
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
        />
    );
};

export default CartContainer;
