// pages/index.tsx - Optimized version
import { useEffect, useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../comps/hooks';
import { setProducts } from '../comps/productSlice';
import { addToCart, decrementFromCart } from '../comps/cartSlice';
import { productData } from '../comps/productData';
import { Api } from '../comps/types';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";
import Footer from '@/comps/footer';
// Lazy load heavy components
const CartDisplay = dynamic(() => import('@/components/cartDisplay'), {
    loading: () => <div>Loading cart...</div>
});

const PaystackCheckout = dynamic(() => import('../components/PaystackCheckout'), {
    loading: () => <div>Loading checkout...</div>
});

// Move styles outside component to prevent recreation
const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    cartSummary: { 
        marginBottom: '30px', 
        padding: '15px', 
        border: '1px solid #ddd', 
        borderRadius: '5px',
        backgroundColor: '#f8f9fa'
    },
    cartSummaryFlex: { display: 'flex', gap: '20px', alignItems: 'center' },
    cartItemsContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
    cartItem: { 
        padding: '5px 10px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        borderRadius: '15px',
        fontSize: '12px'
    },
    productsGrid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
    },
    productCard: { 
        padding: '15px', 
        borderRadius: '5px',
        position: 'relative' as const
    },
    inCartBadge: { 
        position: 'absolute' as const, 
        top: '10px', 
        right: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        padding: '5px 8px',
        borderRadius: '10px',
        fontSize: '12px',
        fontWeight: 'bold' as const
    },
    buttonContainer: { display: 'flex', gap: '10px', flexWrap: 'wrap' as const },
    button: { 
        padding: '8px 16px', 
        border: 'none', 
        borderRadius: '3px',
        cursor: 'pointer',
        flex: '1',
        minWidth: '120px'
    },
    addButton: { backgroundColor: '#007bff', color: 'white' },
    removeButton: { backgroundColor: '#dc3545', color: 'white' },
    postCard: { 
        marginBottom: '20px', 
        padding: '15px', 
        border: '1px solid #eee', 
        borderRadius: '5px' 
    }
} as const;


export default function Home({ details }: { details: Api[] }) {
    const dispatch = useAppDispatch();
    const products = useAppSelector(state => state.products.products);
    const cartItems = useAppSelector(state => state.cart.items);
    const cartTotal = useAppSelector(state => state.cart.total);
    
    // Memoize expensive calculations
    const totalItemsInCart = useMemo(() => 
        cartItems.reduce((sum, item) => sum + item.quantity, 0), 
        [cartItems]
    );

    const cartItemsMap = useMemo(() => 
        new Map(cartItems.map(item => [item.id, item])), 
        [cartItems]
    );

    // Initialize products only once
    useEffect(() => {
        if (products.length === 0) {
            dispatch(setProducts(productData));
        }
    }, [dispatch, products.length]);

    // Memoized callbacks to prevent unnecessary re-renders
    const handleAddToCart = useCallback((productId: number) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            dispatch(addToCart(product));
        }
    }, [products, dispatch]);

    const handleRemoveOneFromCart = useCallback((productId: number) => {
        dispatch(decrementFromCart(productId));
    }, [dispatch]);

    const getItemQuantityInCart = useCallback((productId: number) => {
        return cartItemsMap.get(productId)?.quantity || 0;
    }, [cartItemsMap]);

    const isItemInCart = useCallback((productId: number) => {
        return cartItemsMap.has(productId);
    }, [cartItemsMap]);

    // Memoize cart items display
    const cartItemsDisplay = useMemo(() => (
        <div style={{ marginTop: '10px' }}>
            <h4>Items in Cart:</h4>
            <div style={styles.cartItemsContainer}>
                {cartItems.map(item => (
                    <span 
                        key={item.id}
                        style={styles.cartItem}
                    >
                        {item.name} x{item.quantity}
                    </span>
                ))}
            </div>
        </div>
    ), [cartItems]);

    // Memoize products display
    const productsDisplay = useMemo(() => (
        <div style={styles.productsGrid}>
            {products.map((product) => {
                const quantityInCart = getItemQuantityInCart(product.id);
                const inCart = isItemInCart(product.id);
                
                return (
                    <div 
                        key={product.id} 
                        style={{ 
                            ...styles.productCard,
                            border: inCart ? '2px solid #28a745' : '1px solid #ddd'
                        }}
                    >
                        {inCart && (
                            <div style={styles.inCartBadge}>
                                In Cart: {quantityInCart}
                            </div>
                        )}
                        
                        <h3>{product.name}</h3>
                        <p>Size: {product.size}</p>
                      <p>Price: ₦{product.price.toLocaleString()}</p>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <Image 
                                src={product.photoUrl}
                                width={200}
                                height={200}
                                alt={`${product.name} product image`}
                                style={{ objectFit: 'cover', borderRadius: '5px' }}
                                priority={product.id <= 4} // Priority loading for first 4 images
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                            />
                        </div>
                        
                        <div style={styles.buttonContainer}>
                            <button 
                                onClick={() => handleAddToCart(product.id)}
                                style={{ 
                                    ...styles.button,
                                    ...styles.addButton
                                }}
                                type="button"
                            >
                                Add to Cart
                            </button>
                            
                            {inCart && (
                                <button 
                                    onClick={() => handleRemoveOneFromCart(product.id)}
                                    style={{ 
                                        ...styles.button,
                                        ...styles.removeButton
                                    }}
                                    type="button"
                                >
                                    Remove One
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    ), [products, getItemQuantityInCart, isItemInCart, handleAddToCart, handleRemoveOneFromCart]);
const variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {  opacity: 1,  y: 0, transition: {  duration: 2.5,ease: "easeOut"
    }
  }, 
  exit: { opacity: 0, y: 50 }
}

    return (
        <div style={styles.container}>
     <motion.div
 variants={variants}
  initial="hidden"
  animate="visible"
  exit="exit"
 
>
  Fades in and scales up
</motion.div>
            <h1>Black Fit Store</h1>
            <i className="fa-regular fa-bell"></i>
            
            {/* Cart Summary */}
            <div style={styles.cartSummary}>
                <h2>Cart Summary</h2>
                <div style={styles.cartSummaryFlex}>
                    <p><strong>Unique Items:</strong> {cartItems.length}</p>
                    <p><strong>Total Quantity:</strong> {totalItemsInCart}</p>
                    <p><strong>Total Value:</strong> ₦{cartTotal.toLocaleString()}</p>
                </div>
                
                {cartItems.length > 0 && cartItemsDisplay}
            </div>

            {/* Products */}
            <div style={{ marginBottom: '30px' }}>
                <h2>Products ({products.length})</h2>
                {productsDisplay}
            </div>

            {/* Lazy loaded components */}
            <PaystackCheckout />
            <CartDisplay />
           
        <Footer/>
        </div>
    );
}