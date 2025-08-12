'use client';
import React from 'react';
import { motion } from 'framer-motion';
import NextImage from 'next/image';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../comps/hooks';
import { addToCart, decrementFromCart } from '../comps/cartSlice';
import { productData } from '../comps/productData';

interface Styles {
  [key: string]: React.CSSProperties;
}

const styles: Styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
    padding: '2rem'
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  productsSection: {
    marginTop: '6rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#fff',
    textAlign: 'center'
  },
  productsGridContainer: {
    overflowX: 'auto',
    padding: '1rem',
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    position: 'relative',
    scrollBehavior: 'smooth',
  },
  productsGrid: {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '1rem',
    flexWrap: 'nowrap',
    width: 'max-content'
  },
  productCard: {
    padding: '1.5rem',
    borderRadius: '15px',
    backgroundColor: '#111',
    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    position: 'relative',
    border: '1px solid #333',
    width: '280px',
    flexShrink: 0,
  },
  productCardInCart: {
    border: '2px solid #007bff',
    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
  },
  inCartBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '10px',
    fontSize: '0.7rem',
    fontWeight: 'bold'
  },
  productTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  productInfo: {
    color: '#ccc',
    marginBottom: '0.5rem',
    fontSize: '0.9rem'
  },
  productPrice: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '1rem'
  },
  imageContainer: {
    marginBottom: '1rem',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    height: '180px',
    position: 'relative'
  },
  buttonContainer: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem'
  },
  button: {
    flex: 1,
    padding: '0.6rem',
    fontSize: '0.8rem',
    fontWeight: 'bold',
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
  },
  scrollButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
    padding: '0 1rem'
  },
  scrollButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  scrollButtonDisabled: {
    opacity: 0.3,
    cursor: 'not-allowed',
    transform: 'none !important'
  }
};

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
  }),
  hover: {
    y: -5,
    boxShadow: '0 8px 25px rgba(255, 255, 255, 0.15)'
  }
};

interface Product {
  id: number;
  name: string;
  size: number;
  price: number;
  photoUrl: string;
  fullimage?: string;
  description?: string; 
}

const ProductCard: React.FC<{
  product: Product;
  index: number;
  inCart: boolean;
  quantityInCart: number;
  openModal: (product: Product) => void;
  handleAddToCart: (id: number) => void;
  handleRemoveOneFromCart: (id: number) => void;
}> = React.memo(({ 
  product, 
  index,
  inCart,
  quantityInCart,
  openModal,
  handleAddToCart,
  handleRemoveOneFromCart 
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(product);
    }
  }, [openModal, product]);

  return (
    <motion.div 
      style={{
        ...styles.productCard,
        ...(inCart ? styles.productCardInCart : {})
      }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover="hover"
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
        style={styles.imageContainer} 
        onClick={() => openModal(product)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${product.name}`}
      >
        <NextImage 
          src={imageError ? '/api/placeholder/280/180' : product.photoUrl}
          fill
          alt={`${product.name} product image`}
          style={{ 
            objectFit: 'cover',
            filter: inCart ? 'grayscale(0%)' : 'grayscale(20%)',
            transition: 'filter 0.3s ease'
          }}
          priority={index < 4}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          onError={handleImageError}
        />
      </div>

      <div style={styles.buttonContainer}>
        <motion.button
          onClick={() => handleAddToCart(product.id)}
          style={{ 
            ...styles.button, 
            ...styles.addButton 
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </motion.button>

        {inCart && (
          <motion.button
            onClick={() => handleRemoveOneFromCart(product.id)}
            style={{ 
              ...styles.button, 
              ...styles.removeButton 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Remove ${product.name} from cart`}
          >
            Remove
          </motion.button>
        )}
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

const ScrollButton = ({
  direction,
  onClick,
  disabled
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.scrollButton,
        ...(disabled && styles.scrollButtonDisabled)
      }}
      whileHover={!disabled ? {
        background: 'rgba(255, 255, 255, 0.2)',
        scale: 1.05
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      aria-label={`Scroll ${direction}`}
    >
      {direction === 'left' ? '←' : '→'}
    </motion.button>
  );
};

const Shop = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  
  const productsContainerRef = useRef<HTMLDivElement>(null);
  const suggestedContainerRef = useRef<HTMLDivElement>(null);
  
  const [modal, setModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAtProductsStart, setIsAtProductsStart] = useState(true);
  const [isAtProductsEnd, setIsAtProductsEnd] = useState(false);
  const [isAtSuggestedStart, setIsAtSuggestedStart] = useState(true);
  const [isAtSuggestedEnd, setIsAtSuggestedEnd] = useState(false);

  const shopProducts = useMemo(() => productData.slice(0, 6), []);
  const suggestedProducts = useMemo(() => productData.slice(6, 12), []);

  const cartItemsMap = useMemo(() => 
    new Map(cartItems.map(item => [item.id, item])), 
    [cartItems]
  );

  const handleScrollLeftProducts = useCallback(() => {
    if (!productsContainerRef.current) return;
    
    const container = productsContainerRef.current;
    const cardWidth = 280 + 24;
    const scrollAmount = Math.min(cardWidth * 2, container.scrollLeft);
    
    container.scrollTo({
      left: container.scrollLeft - scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  const handleScrollRightProducts = useCallback(() => {
    if (!productsContainerRef.current) return;
    
    const container = productsContainerRef.current;
    const cardWidth = 280 + 24;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const scrollAmount = Math.min(cardWidth * 2, maxScroll - container.scrollLeft);
    
    container.scrollTo({
      left: container.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  const handleScrollLeftSuggested = useCallback(() => {
    if (!suggestedContainerRef.current) return;
    
    const container = suggestedContainerRef.current;
    const cardWidth = 280 + 24;
    const scrollAmount = Math.min(cardWidth * 2, container.scrollLeft);
    
    container.scrollTo({
      left: container.scrollLeft - scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  const handleScrollRightSuggested = useCallback(() => {
    if (!suggestedContainerRef.current) return;
    
    const container = suggestedContainerRef.current;
    const cardWidth = 280 + 24;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const scrollAmount = Math.min(cardWidth * 2, maxScroll - container.scrollLeft);
    
    container.scrollTo({
      left: container.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  const setupScrollTracking = (
    container: HTMLDivElement | null,
    setIsAtStart: React.Dispatch<React.SetStateAction<boolean>>,
    setIsAtEnd: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setIsAtStart(scrollLeft <= 10);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
    };

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  };

  useEffect(() => {
    const productsCleanup = setupScrollTracking(
      productsContainerRef.current, 
      setIsAtProductsStart, 
      setIsAtProductsEnd
    );
    const suggestedCleanup = setupScrollTracking(
      suggestedContainerRef.current, 
      setIsAtSuggestedStart, 
      setIsAtSuggestedEnd
    );

    return () => {
      productsCleanup?.();
      suggestedCleanup?.();
    };
  }, []);

  const openModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setModal(false);
    setSelectedProduct(null);
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, [closeModal]);

  const handleAddToCart = useCallback((productId: number) => {
    const product = [...shopProducts, ...suggestedProducts].find(p => p.id === productId);
    if (product) {
      dispatch(addToCart(product));
    }
  }, [shopProducts, suggestedProducts, dispatch]);

  const handleRemoveOneFromCart = useCallback((productId: number) => {
    dispatch(decrementFromCart(productId));
  }, [dispatch]);

  const getItemQuantityInCart = useCallback((productId: number) => {
    return cartItemsMap.get(productId)?.quantity || 0;
  }, [cartItemsMap]);

  const isItemInCart = useCallback((productId: number) => {
    return cartItemsMap.has(productId);
  }, [cartItemsMap]);

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [modal]);

  // Preload full image when product is selected
  useEffect(() => {
    if (selectedProduct?.fullimage) {
      const img = new Image();
      img.src = selectedProduct.fullimage;
    }
  }, [selectedProduct]);

  return (
    <>
      <br />
      <div style={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={styles.heroSection}
        > 
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '2.5rem' }}>
            Welcome to Our Shop
          </h1>
          <p style={{ color: '#d1d5db', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
            Discover amazing products at great prices
          </p>
        </motion.div>

        {modal && selectedProduct && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            style={{ 
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="bg-black rounded-lg p-6 max-w-4xl w-full mx-4 relative my-8 max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeModal}
                className="text-red-500 text-2xl absolute top-2 right-2 hover:text-red-700 z-10 sticky"
                aria-label="Close product details"
                style={{ position: 'sticky', top: '8px' }}
              >
                ×
              </button>
              
              <div className="flex flex-col md:flex-row gap-6 pt-8">
                <div className="md:w-1/2 relative aspect-square">
                  <NextImage 
                    src={selectedProduct.fullimage || selectedProduct.photoUrl}
                    width={300}
                    height={400}
                    alt={`Detailed view of ${selectedProduct.name} by Blacksfit - Nigerian streetwear`}
                    className="w-full h-auto rounded-lg object-cover"
                    priority
                    quality={85}
                    fetchPriority="high"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                
                <div className="md:w-1/2">
                  <div className="mt-0 md:mt-4">
                    <h1 id="modal-title" className="text-xl font-bold text-white-800 mb-2">
                      {selectedProduct.name}
                    </h1>
                    <p className="text-gray-600 mb-2">Size: {selectedProduct.size}</p>
                    <p className="text-blue-600 font-bold text-lg mb-4">
                      ₦{selectedProduct.price.toLocaleString()}
                    </p>
                    <p className="text-white-700 mb-4">
                      This limited edition piece is part of our Lagos-inspired collection, 
                      crafted with premium materials for the Nigerian climate. Each Blacksfit 
                      item is designed for comfort and style in urban environments, with 
                      attention to detail that reflects Nigerian street culture.
                    </p>
                    <p className="text-white-700 mb-4">
                      <strong>Material:</strong> Premium cotton blend<br/>
                      <strong>Care Instructions:</strong> Machine wash cold, tumble dry low<br/>
                      <strong>Delivery:</strong> Free nationwide shipping (1-3 business days in Lagos)
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4 sticky bottom-0 bg-black pt-4">
                    <motion.button
                      onClick={closeModal}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Close
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        handleAddToCart(selectedProduct.id);
                        closeModal();
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={styles.productsSection}>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={styles.sectionTitle}
          >
            Best Selling ({shopProducts.length})
          </motion.h2>
          
          <div 
            style={styles.productsGridContainer} 
            ref={productsContainerRef}
          >
            <div style={styles.productsGrid}>
              {shopProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  inCart={isItemInCart(product.id)}
                  quantityInCart={getItemQuantityInCart(product.id)}
                  openModal={openModal}
                  handleAddToCart={handleAddToCart}
                  handleRemoveOneFromCart={handleRemoveOneFromCart}
                />
              ))}
            </div>
          </div>

          <div style={styles.scrollButtonsContainer}>
            <ScrollButton 
              direction="left" 
              onClick={handleScrollLeftProducts}
              disabled={isAtProductsStart}
            />
            <ScrollButton 
              direction="right" 
              onClick={handleScrollRightProducts}
              disabled={isAtProductsEnd}
            />
          </div>
        </div>

        {suggestedProducts.length > 0 && (
          <div style={styles.productsSection}>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={styles.sectionTitle}
            >
              New Arrivals
            </motion.h2>
            
            <div 
              style={styles.productsGridContainer} 
              ref={suggestedContainerRef}
            >
              <div style={styles.productsGrid}>
                {suggestedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index + shopProducts.length}
                    inCart={isItemInCart(product.id)}
                    quantityInCart={getItemQuantityInCart(product.id)}
                    openModal={openModal}
                    handleAddToCart={handleAddToCart}
                    handleRemoveOneFromCart={handleRemoveOneFromCart}
                  />
                ))}
              </div>
            </div>

            <div style={styles.scrollButtonsContainer}>
              <ScrollButton 
                direction="left" 
                onClick={handleScrollLeftSuggested}
                disabled={isAtSuggestedStart}
              />
              <ScrollButton 
                direction="right" 
                onClick={handleScrollRightSuggested}
                disabled={isAtSuggestedEnd}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Shop;