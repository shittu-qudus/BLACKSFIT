'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../comps/hooks';
import { addToCart, decrementFromCart } from '../comps/cartSlice';
import { productData } from '../comps/productData';

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
    padding: '2rem'
  },
  heroSection: {
    textAlign: 'center' as const,
    marginBottom: '3rem'
  },
  productsSection: {
    marginTop: '6rem'
  },
  sectionTitle: {
    
    fontSize: '2rem',
    fontWeight: 'bold' as const,
    marginBottom: '1.5rem',
    color: '#fff',
    textAlign: 'center' as const
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

// Animation variants
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

export default function Shop() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  
  // Modal state
  const [modal, setModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Extract some products for the shop (you can modify this selection)
  const shopProducts = useMemo(() => 
    productData.slice(0, 6), // Take first 6 products
    []
  );

  const suggestedProducts = useMemo(() => 
    productData.slice(6, 12), // Take next 6 products as suggestions
    []
  );

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

  // Memoize cart items map
  const cartItemsMap = useMemo(() => 
    new Map(cartItems.map(item => [item.id, item])), 
    [cartItems]
  );

  // Memoized callbacks
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

  // Product card component
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

  return (
    <>
    <br></br>
    <div style={styles.container}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={styles.heroSection}
      > 
     
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">
          Welcome to Our Shop
        </h1>
        <p className="text-gray-300 text-lg mb-6">
          Discover amazing products at great prices
        </p>
      
      </motion.div>

      {/* Modal */}
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
        <div style={styles.productsGrid}>
          {shopProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
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
          <div style={styles.productsGrid}>
            {suggestedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index + shopProducts.length} />
            ))}
          </div>
        </div>
      )}
    </div></>
  );
}