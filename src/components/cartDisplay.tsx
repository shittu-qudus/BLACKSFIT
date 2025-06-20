// components/CartDisplay.tsx
import React from 'react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../comps/hooks';
import { 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    clearCart,
    decrementFromCart 
} from '../comps/cartSlice';

const CartDisplay: React.FC = () => {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(state => state.cart.items);
    const cartTotal = useAppSelector(state => state.cart.total);
    
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleRemoveItem = (itemId: number) => {
        dispatch(removeFromCart(itemId));
    };

    const handleIncrement = (itemId: number) => {
        dispatch(incrementQuantity(itemId));
    };

    const handleDecrement = (itemId: number) => {
        dispatch(decrementQuantity(itemId));
    };

    const handleDecrementFromCart = (itemId: number) => {
        dispatch(decrementFromCart(itemId));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    if (cartItems.length === 0) {
        return (
            <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                margin: '20px 0'
            }}>
                <h2>Your Cart is Empty</h2>
                <p>Add some products to see them here!</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', margin: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Shopping Cart ({totalQuantity} items)</h2>
                <button 
                    onClick={handleClearCart}
                    style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                >
                    Clear Cart
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {cartItems.map((item) => (
                    <div 
                        key={item.id} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            padding: '15px', 
                            border: '1px solid #eee', 
                            borderRadius: '5px',
                            gap: '15px'
                        }}
                    >
                        {/* Product Image */}
                        <div style={{ flexShrink: 0 }}>
                            <Image 
                                src={item.photoUrl}
                                width={80}
                                height={80}
                                alt={`${item.name} product image`}
                                style={{ objectFit: 'cover', borderRadius: '5px' }}
                            />
                        </div>

                        {/* Product Details */}
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                            <p style={{ margin: '0 0 5px 0', color: '#666' }}>Size: {item.size}</p>
                            <p style={{ margin: '0', fontWeight: 'bold' }}>₦{item.price.toLocaleString()}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button 
                                onClick={() => handleDecrement(item.id)}
                                style={{ 
                                    padding: '5px 10px', 
                                    backgroundColor: '#6c757d', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    minWidth: '30px'
                                }}
                            >
                                -
                            </button>
                            <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>
                                {item.quantity}
                            </span>
                            <button 
                                onClick={() => handleIncrement(item.id)}
                                style={{ 
                                    padding: '5px 10px', 
                                    backgroundColor: '#28a745', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    minWidth: '30px'
                                }}
                            >
                                +
                            </button>
                        </div>

                        {/* Item Subtotal */}
                        <div style={{ textAlign: 'right', minWidth: '100px' }}>
                            <p style={{ margin: '0', fontWeight: 'bold' }}>
                                ₦{(item.price * item.quantity).toLocaleString()}
                            </p>
                        </div>

                        {/* Remove Button */}
                        <button 
                            onClick={() => handleRemoveItem(item.id)}
                            style={{ 
                                padding: '5px 10px', 
                                backgroundColor: '#dc3545', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '3px',
                                cursor: 'pointer'
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {/* Cart Total */}
            <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '5px',
                textAlign: 'right'
            }}>
                <h3 style={{ margin: '0 0 10px 0' }}>
                    Total: ₦{cartTotal.toLocaleString()}
                </h3>
                <button 
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default CartDisplay;