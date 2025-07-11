// pages/index.tsx - Updated with shop-style animations and modal
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../comps/hooks';
import { setProducts } from '../comps/productSlice';
import { addToCart, decrementFromCart } from '../comps/cartSlice';
import { productData } from '../comps/productData';
import { Api } from '../comps/types';
import Image from 'next/image';
import { motion } from "framer-motion";
import BlacksfitBanner from '@/comps/bg';

const styles = {
    container: { 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh'
    },
  
    cartSummary: { 
        margin: '2rem',
        padding: '1.5rem', 
        border: '1px solid #333', 
        borderRadius: '10px',
        backgroundColor: '#111'
    },
    cartSummaryFlex: { 
        display: 'flex', 
        gap: '20px', 
        alignItems: 'center',
        flexWrap: 'wrap' as const
    },
    cartItemsContainer: { 
        display: 'flex', 
        flexWrap: 'wrap' as const, 
        gap: '10px',
        marginTop: '1rem'
    },
    cartItem: { 
        padding: '8px 12px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        borderRadius: '20px',
        fontSize: '0.875rem',
        fontWeight: '500' as const
    },
    productsSection: {
        padding: '2rem'
    },
    sectionTitle: {
        fontSize: '2rem',
        fontWeight: 'bold' as const,
        marginBottom: '1.5rem',
        color: '#fff'
    },
    productsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
    },
    productCard: {
        padding: '1.5rem',
        borderRadius: '15px',
        backgroundColor: '#111',
        boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        position: 'relative' as const,
        border: '1px solid #333'
    },
    productCardInCart: {
        border: '2px solid #007bff',
        boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
    },
    inCartBadge: {
        position: 'absolute' as const,
        top: '10px',
        right: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        padding: '6px 10px',
        borderRadius: '15px',
        fontSize: '0.75rem',
        fontWeight: 'bold' as const
    },
    productTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold' as const,
        marginBottom: '0.5rem',
        color: '#fff'
    },
    productInfo: {
        color: '#ccc',
        marginBottom: '0.5rem'
    },
    productPrice: {
        fontSize: '1.1rem',
        fontWeight: 'bold' as const,
        color: '#007bff',
        marginBottom: '1rem'
    },
    imageContainer: {
        marginBottom: '1rem',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer'
    },
    buttonContainer: {
        display: 'flex',
        gap: '0.75rem',
        marginTop: '1rem'
    },
    button: {
        flex: 1,
        padding: '0.75rem 1rem',
        fontSize: '0.9rem',
        fontWeight: 'bold' as const,
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    addButton: {
        backgroundColor: '#007bff',
        color: 'white'
    },
    removeButton: {
        backgroundColor: '#dc3545',
        color: 'white'
    }
} as const;

// Animation variants - updated to match shop component
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut"
        }
    })
};

export default function Home() {
    const dispatch = useAppDispatch();
    const products = useAppSelector(state => state.products.products);
    const cartItems = useAppSelector(state => state.cart.items);
    const cartTotal = useAppSelector(state => state.cart.total);

    // Modal state
    const [modal, setModal] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const openModal = (product: any) => {
        setSelectedProduct(product);
        setModal(true);
    };
    
    const closeModal = () => {
        setModal(false);
        setSelectedProduct(null);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

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

    // Product card component - updated to match shop component
    const ProductCard = ({ product, index }: { product: any, index: number }) => {
        const quantityInCart = getItemQuantityInCart(product.id);
        const inCart = isItemInCart(product.id);

        return (
            <motion.div 
                key={product.id}
                style={{
                    ...styles.productCard,
                    ...(inCart ? styles.productCardInCart : {})
                }}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover={{ 
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(255, 255, 255, 0.15)'
                }}
            >
                {inCart && (
                    <div style={styles.inCartBadge}>
                        In Cart: {quantityInCart}
                    </div>
                )}

                <h3 style={styles.productTitle}>{product.name}</h3>
                <p style={styles.productInfo}>Size: {product.size}</p>
                <p style={styles.productPrice}>₦{product.price.toLocaleString()}</p>

                <div 
                    onClick={() => openModal(product)} 
                    style={styles.imageContainer}
                >
                    <Image 
                        src={product.photoUrl}
                        width={250}
                        height={200}
                        alt={`${product.name} product image`}
                        style={{ 
                            objectFit: 'cover', 
                            width: '100%',
                            height: 'auto',
                            filter: inCart ? 'grayscale(0%)' : 'grayscale(20%)',
                            transition: 'filter 0.3s ease'
                        }}
                        priority={index < 4}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                </div>

                <div style={styles.buttonContainer}>
                    <motion.button
                        onClick={() => handleAddToCart(product.id)}
                        style={{ ...styles.button, ...styles.addButton }}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Add to Cart
                    </motion.button>

                    {inCart && (
                        <motion.button
                            onClick={() => handleRemoveOneFromCart(product.id)}
                            style={{ ...styles.button, ...styles.removeButton }}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Remove One
                        </motion.button>
                    )}
                </div>
            </motion.div>
        );
    };

    // Memoize cart summary display
    const cartSummaryDisplay = useMemo(() => (
        <motion.div 
            style={styles.cartSummary}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div style={styles.cartSummaryFlex}>
                <div>
                    <h3>Cart Summary</h3>
                    <p>Total Items: <strong>{totalItemsInCart}</strong></p>
                    <p>Total Value: <strong>₦{cartTotal.toLocaleString()}</strong></p>
                </div>
            </div>
            
            {cartItems.length > 0 && (
                <div>
                    <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Items in Cart:</h4>
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
            )}
        </motion.div>
    ), [cartItems, totalItemsInCart, cartTotal]);

    return (
        <div style={styles.container}>
            <BlacksfitBanner/>
            
            {/* Modal - updated to match shop component */}
            {modal && selectedProduct && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
                        <button
                            onClick={closeModal}
                            className="text-red-500 text-2xl absolute top-2 right-2 hover:text-red-700"
                        >
                            ×
                        </button>
                        
                        <Image 
                            src={selectedProduct.fullimage || selectedProduct.photoUrl}
                            width={250}
                            height={200}
                            alt={`${selectedProduct.name} product image`}
                            style={{ 
                                objectFit: 'cover', 
                                width: '100%',
                                height: 'auto'
                            }}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
                        
                        <div className="mt-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h3>
                            <p className="text-gray-600 mb-2">Size: {selectedProduct.size}</p>
                            <p className="text-blue-600 font-bold text-lg mb-4">₦{selectedProduct.price.toLocaleString()}</p>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleAddToCart(selectedProduct.id);
                                    closeModal();
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Summary */}
            {cartSummaryDisplay}
            
            {/* Products Section */}
            <div style={styles.productsSection}>
                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    style={styles.sectionTitle}
                >
                    Products ({products.length})
                </motion.h2>
                <div style={styles.productsGrid}>
                    {products.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

   {/* Cart Summary */}
            {/* <div style={styles.cartSummary}>
                <h2>Cart Summary</h2>
                <div style={styles.cartSummaryFlex}>
                    <p><strong>Unique Items:</strong> {cartItems.length}</p>
                    <p><strong>Total Quantity:</strong> {totalItemsInCart}</p>
                    <p><strong>Total Value:</strong> ₦{cartTotal.toLocaleString()}</p>
                </div>
                
                {cartItems.length > 0 && cartItemsDisplay}
            </div> */}