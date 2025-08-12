// components/CartDisplay.tsx
import React from 'react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../comps/hooks';
import { 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    clearCart,
    
} from '../comps/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic imports with loading states
const PaystackCheckout = dynamic(() => import('@/components/PaystackCheckout'), {
    loading: () => (
        <div style={{ 
            padding: '1rem', 
            textAlign: 'center', 
            color: '#666',
            fontStyle: 'italic' 
        }}>
            Loading checkout...
        </div>
    ),
    ssr: false,
});

// Responsive breakpoints and styles
const styles = {
    container: {
        padding: '1rem',
        margin: '1rem auto',
        maxWidth: '1200px',
        backgroundColor: '#000',
        color: '#fff',
        borderRadius: '12px',
        border: '1px solid #333',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        minHeight: '200px'
    },
    emptyCart: {
        textAlign: 'center' as const,
        padding: '3rem 1rem',
        backgroundColor: '#111',
        borderRadius: '12px',
        border: '1px solid #333'
    },
    emptyCartTitle: {
        fontSize: 'clamp(1.25rem, 4vw, 2rem)',
        marginBottom: '1rem',
        color: '#fff'
    },
    emptyCartText: {
        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
        color: '#999',
        marginBottom: '2rem'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '0 0.5rem',
        flexWrap: 'wrap' as const,
        gap: '1rem'
    },
    title: {
        fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
        marginTop:"20px",
        margin: 0,
        color: '#fff',
        fontWeight: 'bold' as const
    },
    clearButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
        fontWeight: '600' as const,
        transition: 'all 0.3s ease',
        minWidth: '120px'
    },
    itemsList: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1rem'
    },
    cartItem: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto auto',
        gridTemplateAreas: `
            "image details quantity subtotal remove"
        `,
        alignItems: 'center',
        padding: '1.5rem',
        backgroundColor: '#111',
        borderRadius: '12px',
        border: '1px solid #333',
        gap: '1rem',
        transition: 'all 0.3s ease'
    },
    // Mobile layout
    cartItemMobile: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gridTemplateAreas: `
            "image details"
            "controls controls"
        `,
        gap: '1rem',
        padding: '1rem',
        backgroundColor: '#111',
        borderRadius: '12px',
        border: '1px solid #333'
    },
    // Tablet layout
    cartItemTablet: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gridTemplateAreas: `
            "image details controls"
        `,
        gap: '1rem',
        padding: '1.25rem',
        backgroundColor: '#111',
        borderRadius: '12px',
        border: '1px solid #333'
    },
    imageContainer: {
        gridArea: 'image',
        flexShrink: 0,
        borderRadius: '8px',
        overflow: 'hidden'
    },
    productDetails: {
        gridArea: 'details',
        minWidth: 0 // Prevents overflow
    },
    productName: {
        margin: '0 0 0.5rem 0',
        fontSize: 'clamp(1rem, 3vw, 1.25rem)',
        fontWeight: 'bold' as const,
        color: '#fff'
    },
    productInfo: {
        margin: '0 0 0.25rem 0',
        color: '#999',
        fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)'
    },
    productPrice: {
        margin: 0,
        fontWeight: 'bold' as const,
        color: '#007bff',
        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
    },
    quantityControls: {
        gridArea: 'quantity',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: '#222',
        padding: '0.5rem',
        borderRadius: '8px',
        border: '1px solid #444'
    },
    quantityButton: {
        width: '36px',
        height: '36px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1.2rem',
        fontWeight: 'bold' as const,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
    },
    decrementButton: {
        backgroundColor: '#6c757d',
        color: 'white'
    },
    incrementButton: {
        backgroundColor: '#28a745',
        color: 'white'
    },
    quantityDisplay: {
        minWidth: '40px',
        textAlign: 'center' as const,
        fontWeight: 'bold' as const,
        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
        color: '#fff'
    },
    subtotal: {
        gridArea: 'subtotal',
        textAlign: 'right' as const,
        fontWeight: 'bold' as const,
        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
        color: '#fff',
        minWidth: '100px'
    },
    removeButton: {
        gridArea: 'remove',
        padding: '0.5rem 1rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: 'clamp(0.8rem, 2vw, 0.85rem)',
        fontWeight: '600' as const,
        transition: 'all 0.2s ease'
    },
    mobileControls: {
        gridArea: 'controls',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #333'
    },
    checkoutSection: {
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#111',
        borderRadius: '12px',
        border: '1px solid #333'
    }
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4 }
    },
    exit: {
        opacity: 0,
        x: 100,
        scale: 0.95,
        transition: { duration: 0.3 }
    }
};

const emptyCartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

// Hook for responsive breakpoints
const useResponsive = () => {
    const [windowWidth, setWindowWidth] = React.useState(0);

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        isMobile: windowWidth < 768,
        isTablet: windowWidth >= 768 && windowWidth < 1024,
        isDesktop: windowWidth >= 1024
    };
};

const CartDisplay: React.FC = () => {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(state => state.cart.items);
    // const cartTotal = useAppSelector(state => state.cart.total);
    const { isMobile, isTablet } = useResponsive();
    
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

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    // Get appropriate cart item style based on screen size
    const getCartItemStyle = () => {
        if (isMobile) return styles.cartItemMobile;
        if (isTablet) return styles.cartItemTablet;
        return styles.cartItem;
    };

    if (cartItems.length === 0) {
        return (
            <motion.div 
                style={styles.container}
                variants={emptyCartVariants}
                initial="hidden"
                animate="visible"
            >
                <div style={styles.emptyCart}>
                    <motion.h2 
                        style={styles.emptyCartTitle}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        🛒 Your Cart is Empty
                    </motion.h2>
                    <motion.p 
                        style={styles.emptyCartText}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Add some amazing products to see them here!
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    >
                        🛍️
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            style={styles.container}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div 
                style={styles.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 style={styles.title}>
                    🛒 Shopping Cart ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})
                </h2>
                <motion.button 
                    onClick={handleClearCart}
                    style={styles.clearButton}
                    whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: '#c82333',
                        boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)'
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    Clear All
                </motion.button>
            </motion.div>

            {/* Cart Items */}
            <div style={styles.itemsList}>
                <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                        <motion.div 
                            key={item.id}
                            style={getCartItemStyle()}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            whileHover={{ 
                                scale: 1.02,
                                backgroundColor: '#1a1a1a',
                                borderColor: '#555'
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Product Image */}
                            <div style={styles.imageContainer}>
                                <Image 
                                    src={item.photoUrl}
                                    width={isMobile ? 60 : 80}
                                    height={isMobile ? 60 : 80}
                                    alt={`${item.name} product image`}
                                    style={{ 
                                        objectFit: 'cover', 
                                        borderRadius: '8px',
                                        transition: 'transform 0.3s ease'
                                    }}
                                />
                            </div>

                            {/* Product Details */}
                            <div style={styles.productDetails}>
                                <h4 style={styles.productName}>{item.name}</h4>
                                <p style={styles.productInfo}>Size: {item.size}</p>
                                <p style={styles.productPrice}>₦{item.price.toLocaleString()}</p>
                            </div>

                            {/* Desktop/Tablet Quantity Controls */}
                            {!isMobile && (
                                <div style={styles.quantityControls}>
                                    <motion.button 
                                        onClick={() => handleDecrement(item.id)}
                                        style={{ ...styles.quantityButton, ...styles.decrementButton }}
                                        whileHover={{ scale: 1.1, backgroundColor: '#5a6268' }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        −
                                    </motion.button>
                                    <span style={styles.quantityDisplay}>
                                        {item.quantity}
                                    </span>
                                    <motion.button 
                                        onClick={() => handleIncrement(item.id)}
                                        style={{ ...styles.quantityButton, ...styles.incrementButton }}
                                        whileHover={{ scale: 1.1, backgroundColor: '#218838' }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        +
                                    </motion.button>
                                </div>
                            )}

                            {/* Desktop Subtotal */}
                            {!isMobile && (
                                <div style={styles.subtotal}>
                                    ₦{(item.price * item.quantity).toLocaleString()}
                                </div>
                            )}

                            {/* Desktop Remove Button */}
                            {!isMobile && (
                                <motion.button 
                                    onClick={() => handleRemoveItem(item.id)}
                                    style={styles.removeButton}
                                    whileHover={{ 
                                        scale: 1.05, 
                                        backgroundColor: '#c82333',
                                        boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)'
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Remove
                                </motion.button>
                            )}

                            {/* Mobile Controls */}
                            {isMobile && (
                                <div style={styles.mobileControls}>
                                    <div style={styles.quantityControls}>
                                        <motion.button 
                                            onClick={() => handleDecrement(item.id)}
                                            style={{ ...styles.quantityButton, ...styles.decrementButton }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            −
                                        </motion.button>
                                        <span style={styles.quantityDisplay}>
                                            {item.quantity}
                                        </span>
                                        <motion.button 
                                            onClick={() => handleIncrement(item.id)}
                                            style={{ ...styles.quantityButton, ...styles.incrementButton }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            +
                                        </motion.button>
                                    </div>
                                    
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={styles.subtotal}>
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                        <motion.button 
                                            onClick={() => handleRemoveItem(item.id)}
                                            style={{ ...styles.removeButton, marginTop: '0.5rem' }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Remove
                                        </motion.button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Checkout Section */}
            <motion.div 
                style={styles.checkoutSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                    <PaystackCheckout />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default CartDisplay;