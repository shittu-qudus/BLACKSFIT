'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
    scrollSnapType: 'x mandatory',
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
    scrollSnapAlign: 'start'
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
    marginTop: '1rem'
  },
  scrollButton: {
    background: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  scrollButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  scrollIcon: {
    fontSize: '1.2rem'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    maxWidth: '28rem',
    width: '100%',
    margin: '1rem',
    position: 'relative'
  },
  modalCloseButton: {
    color: '#dc3545',
    fontSize: '1.5rem',
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
  },
  modalImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px'
  },
  modalInfo: {
    marginTop: '1rem'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  modalSize: {
    color: '#6b7280',
    marginBottom: '0.5rem'
  },
  modalPrice: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: '1.125rem',
    marginBottom: '1rem'
  },
  modalButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  modalButton: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  modalCloseBtn: {
    backgroundColor: '#d1d5db',
    color: '#374151'
  },
  modalAddBtn: {
    backgroundColor: '#3b82f6',
    color: 'white'
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
  })
};

interface Product {
  id: number;
  name: string;
  size: number;
  price: number;
  photoUrl: string;
  fullimage?: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
  inCart: boolean;
  quantityInCart: number;
  openModal: (product: Product) => void;
  handleAddToCart: (id: number) => void;
  handleRemoveOneFromCart: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ 
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
      whileHover={{ 
        y: -5,
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
        style={styles.imageContainer} 
        onClick={() => openModal(product)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${product.name}`}
      >
        <Image 
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

const Shop = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const productsContainerRef = useRef<HTMLDivElement>(null);
  const suggestedContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const scrollPosition = useRef(0);
  const scrollDirection = useRef(1);
  const isScrollingPaused = useRef(false);
  
  // Modal state
  const [modal, setModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Extract some products for the shop
  const shopProducts = useMemo(() => productData.slice(0, 6), []);
  const suggestedProducts = useMemo(() => productData.slice(6, 12), []);

  // Memoize cart items map
  const cartItemsMap = useMemo(() => 
    new Map(cartItems.map(item => [item.id, item])), 
    [cartItems]
  );

  // Memoized callbacks
  const openModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setModal(false);
    setSelectedProduct(null);
  }, []);

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

  // Improved scroll handlers
  const handleScrollLeftProducts = useCallback(() => {
    if (productsContainerRef.current) {
      const container = productsContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleScrollRightProducts = useCallback(() => {
    if (productsContainerRef.current) {
      const container = productsContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleScrollLeftSuggested = useCallback(() => {
    if (suggestedContainerRef.current) {
      const container = suggestedContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleScrollRightSuggested = useCallback(() => {
    if (suggestedContainerRef.current) {
      const container = suggestedContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  // Auto-scroll effect using refs to avoid state changes
  useEffect(() => {
    const container = productsContainerRef.current;
    if (!container) return;

    const autoScroll = () => {
      if (!container || isScrollingPaused.current) {
        animationFrameId.current = requestAnimationFrame(autoScroll);
        return;
      }
      
      scrollPosition.current += 0.15 * scrollDirection.current;
      container.scrollLeft = scrollPosition.current;

      const maxScroll = container.scrollWidth - container.clientWidth;
      if (scrollPosition.current >= maxScroll) {
        scrollDirection.current = -1;
      } else if (scrollPosition.current <= 0) {
        scrollDirection.current = 1;
      }

      animationFrameId.current = requestAnimationFrame(autoScroll);
    };

    animationFrameId.current = requestAnimationFrame(autoScroll);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Modal event handlers
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, [closeModal]);

  const handleModalKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  }, [closeModal]);

  // Pause auto-scroll on hover
  const handleMouseEnter = useCallback(() => {
    isScrollingPaused.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isScrollingPaused.current = false;
  }, []);

  // Handle manual scroll start/end
  const handleManualScrollStart = useCallback(() => {
    isScrollingPaused.current = true;
  }, []);

  const handleManualScrollEnd = useCallback(() => {
    isScrollingPaused.current = false;
  }, []);

  // Modal focus management and body scroll lock
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeModal();
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [modal, closeModal]);

  const handleAddToCartFromModal = useCallback(() => {
    if (selectedProduct) {
      handleAddToCart(selectedProduct.id);
      closeModal();
    }
  }, [selectedProduct, handleAddToCart, closeModal]);

  // Check if scroll buttons should be disabled
  const isProductsAtStart = useCallback(() => {
    if (!productsContainerRef.current) return true;
    return productsContainerRef.current.scrollLeft <= 0;
  }, []);

  const isProductsAtEnd = useCallback(() => {
    if (!productsContainerRef.current) return true;
    return (
      productsContainerRef.current.scrollLeft + productsContainerRef.current.clientWidth >=
      productsContainerRef.current.scrollWidth - 1
    );
  }, []);

  const isSuggestedAtStart = useCallback(() => {
    if (!suggestedContainerRef.current) return true;
    return suggestedContainerRef.current.scrollLeft <= 0;
  }, []);

  const isSuggestedAtEnd = useCallback(() => {
    if (!suggestedContainerRef.current) return true;
    return (
      suggestedContainerRef.current.scrollLeft + suggestedContainerRef.current.clientWidth >=
      suggestedContainerRef.current.scrollWidth - 1
    );
  }, []);

  return (
    <>
      <br />
      <div style={styles.container}>
        {/* Hero Section */}
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

        {/* Modal */}
        {modal && selectedProduct && (
          <div
            style={styles.modal}
            onClick={handleBackdropClick}
            onKeyDown={handleModalKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div style={styles.modalContent}>
              <button
                onClick={closeModal}
                style={styles.modalCloseButton}
                aria-label="Close modal"
              >
                ×
              </button>
              
              <Image 
                src={selectedProduct.fullimage || selectedProduct.photoUrl}
                width={500}
                height={400}
                alt={`${selectedProduct.name} product image`}
                style={styles.modalImage}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
              
              <div style={styles.modalInfo}>
                <h3 id="modal-title" style={styles.modalTitle}>{selectedProduct.name}</h3>
                <p style={styles.modalSize}>Size: {selectedProduct.size}</p>
                <p style={styles.modalPrice}>₦{selectedProduct.price.toLocaleString()}</p>
              </div>
              
              <div style={styles.modalButtonContainer}>
                <button
                  onClick={closeModal}
                  style={{...styles.modalButton, ...styles.modalCloseBtn}}
                >
                  Close
                </button>
                <button
                  onClick={handleAddToCartFromModal}
                  style={{...styles.modalButton, ...styles.modalAddBtn}}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Products Section */}
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleManualScrollStart}
            onTouchEnd={handleManualScrollEnd}
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
            <button 
              onClick={handleScrollLeftProducts}
              style={{
                ...styles.scrollButton,
                ...(isProductsAtStart() && styles.scrollButtonDisabled)
              }}
              aria-label="Scroll left"
              disabled={isProductsAtStart()}
            >
              <span style={styles.scrollIcon}>←</span>
            </button>
            <button 
              onClick={handleScrollRightProducts}
              style={{
                ...styles.scrollButton,
                ...(isProductsAtEnd() && styles.scrollButtonDisabled)
              }}
              aria-label="Scroll right"
              disabled={isProductsAtEnd()}
            >
              <span style={styles.scrollIcon}>→</span>
            </button>
          </div>
        </div>

        {/* Suggested Products Section */}
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
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleManualScrollStart}
              onTouchEnd={handleManualScrollEnd}
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
              <button 
                onClick={handleScrollLeftSuggested}
                style={{
                  ...styles.scrollButton,
                  ...(isSuggestedAtStart() && styles.scrollButtonDisabled)
                }}
                aria-label="Scroll left"
                disabled={isSuggestedAtStart()}
              >
                <span style={styles.scrollIcon}>←</span>
              </button>
              <button 
                onClick={handleScrollRightSuggested}
                style={{
                  ...styles.scrollButton,
                  ...(isSuggestedAtEnd() && styles.scrollButtonDisabled)
                }}
                aria-label="Scroll right"
                disabled={isSuggestedAtEnd()}
              >
                <span style={styles.scrollIcon}>→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Shop;