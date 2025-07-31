import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Head from 'next/head';
import { useAppSelector, useAppDispatch } from '../comps/hooks';
import { setProducts } from '../comps/productSlice';
import { addToCart, decrementFromCart } from '../comps/cartSlice';
import { productData } from '../comps/productData';
import Image from 'next/image';
import { motion } from "framer-motion";
import Link from 'next/link';
import BlacksfitBanner from '@/comps/bg';

interface Styles {
    [key: string]: React.CSSProperties;
}

const styles: Styles = {
    container: { 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        paddingBottom: '2rem'
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
        flexWrap: 'wrap'
    },
    cartItemsContainer: { 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '10px',
        marginTop: '1rem'
    },
    cartItem: { 
        padding: '8px 12px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        borderRadius: '20px',
        fontSize: '0.875rem',
        fontWeight: '500'
    },
    productsSection: {
        padding: '2rem',
        maxWidth: '100vw',
        overflow: 'hidden',
        position: 'relative'
    },
    sectionTitle: {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#fff',
        paddingLeft: '1rem'
    },
    productsGridContainer: {
        overflowX: 'auto',
        padding: '1rem',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        position: 'relative'
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
        flexShrink: 0
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
    scrollIcon: {
        fontSize: '1.2rem'
    },
    breadcrumb: {
        padding: '1rem 2rem',
        fontSize: '0.9rem',
        color: '#aaa'
    },
    breadcrumbLink: {
        color: '#007bff',
        textDecoration: 'none',
        margin: '0 5px'
    },
    breadcrumbSeparator: {
        margin: '0 5px',
        color: '#666'
    },
    aboutSection: {
        padding: '2rem',
        backgroundColor: '#111',
        margin: '2rem',
        borderRadius: '10px'
    },
    shippingInfo: {
        padding: '2rem',
        backgroundColor: '#111',
        margin: '2rem',
        borderRadius: '10px'
    }
};

const cardVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (index: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut"
        }
    })
};

const generateProductSchema = (product: any) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.photoUrl,
    "description": `Limited edition ${product.name} by Blacksfit - Nigerian urban fashion streetwear. Size ${product.size}.`,
    "brand": {
        "@type": "Brand",
        "name": "Blacksfit",
        "logo": "https://blacksfit-test.vercel.app/logo.png"
    },
    "offers": {
        "@type": "Offer",
        "url": `https://blacksfit-test.vercel.app/products/${product.id}`,
        "priceCurrency": "NGN",
        "price": product.price,
        "priceValidUntil": "2024-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
                "@type": "MonetaryAmount",
                "value": 0,
                "currency": "NGN"
            },
            "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": "NG"
            }
        }
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "56"
    }
});

const Home = () => {
    const dispatch = useAppDispatch();
    const products = useAppSelector(state => state.products.products);
    const cartItems = useAppSelector(state => state.cart.items);
    const cartTotal = useAppSelector(state => state.cart.total);
    const productsContainerRef = useRef<HTMLDivElement>(null);
    const scrollAnimationRef = useRef<number | null>(null);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const [modal, setModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(setProducts(productData));
        }
    }, [dispatch, products.length]);

    const startAutoScroll = useCallback(() => {
        if (!isAutoScrolling || !productsContainerRef.current) return;

        const container = productsContainerRef.current;
        let scrollPosition = container.scrollLeft;
        let direction = 1;
        const scrollSpeed = 0.15;

        const animate = () => {
            if (!container) return;

            scrollPosition += scrollSpeed * direction;
            container.scrollLeft = scrollPosition;

            const maxScroll = container.scrollWidth - container.clientWidth;
            if (scrollPosition >= maxScroll) {
                direction = -1;
            } else if (scrollPosition <= 0) {
                direction = 1;
            }

            scrollAnimationRef.current = requestAnimationFrame(animate);
        };

        scrollAnimationRef.current = requestAnimationFrame(animate);

        return () => {
            if (scrollAnimationRef.current) {
                cancelAnimationFrame(scrollAnimationRef.current);
            }
        };
    }, [isAutoScrolling]);

    useEffect(() => {
        const cleanup = startAutoScroll();
        return cleanup;
    }, [startAutoScroll]);

    const scrollLeft = useCallback(() => {
        setIsAutoScrolling(false);
        if (productsContainerRef.current) {
            productsContainerRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
        const timer = setTimeout(() => setIsAutoScrolling(true), 8000);
        return () => clearTimeout(timer);
    }, []);

    const scrollRight = useCallback(() => {
        setIsAutoScrolling(false);
        if (productsContainerRef.current) {
            productsContainerRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
        const timer = setTimeout(() => setIsAutoScrolling(true), 8000);
        return () => clearTimeout(timer);
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsAutoScrolling(false);
        if (scrollAnimationRef.current) {
            cancelAnimationFrame(scrollAnimationRef.current);
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsAutoScrolling(true);
    }, []);

    const openModal = useCallback((product: any) => {
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

    const totalItemsInCart = useMemo(() => 
        cartItems.reduce((sum, item) => sum + item.quantity, 0), 
        [cartItems]
    );

    const cartItemsMap = useMemo(() => 
        new Map(cartItems.map(item => [item.id, item])), 
        [cartItems]
    );

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

    const ProductCard = useCallback(({ product, index }: { product: any, index: number }) => {
        const quantityInCart = getItemQuantityInCart(product.id);
        const inCart = isItemInCart(product.id);

        return (
            <motion.article 
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
                    y: -5,
                    boxShadow: '0 8px 25px rgba(255, 255, 255, 0.15)'
                }}
                itemScope
                itemType="https://schema.org/Product"
            >
                <script type="application/ld+json">
                    {JSON.stringify(generateProductSchema(product))}
                </script>

                {inCart && (
                    <div style={styles.inCartBadge}>
                        In Cart: {quantityInCart}
                    </div>
                )}

                <h3 style={styles.productTitle} itemProp="name">{product.name}</h3>
                <p style={styles.productInfo}>Size: <span itemProp="size">{product.size}</span></p>
                <p style={styles.productPrice} itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    ₦<span itemProp="price">{product.price.toLocaleString()}</span>
                    <meta itemProp="priceCurrency" content="NGN" />
                </p>

                <div style={styles.imageContainer} onClick={() => openModal(product)}>
                    <Image 
                        src={product.photoUrl}
                        fill
                        alt={`Buy ${product.name} - Limited Edition Nigerian Streetwear by Blacksfit`}
                        title={`${product.name} | Blacksfit Official Store`}
                        style={{ 
                            objectFit: 'cover',
                            filter: inCart ? 'grayscale(0%)' : 'grayscale(20%)',
                            transition: 'filter 0.3s ease'
                        }}
                        priority={index < 4}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        itemProp="image"
                        loading={index > 3 ? "lazy" : "eager"}
                    />
                </div>

                <div style={styles.buttonContainer}>
                    <motion.button
                        onClick={() => handleAddToCart(product.id)}
                        style={{ ...styles.button, ...styles.addButton }}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Add ${product.name} to cart`}
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
                            aria-label={`Remove one ${product.name} from cart`}
                        >
                            Remove
                        </motion.button>
                    )}
                </div>
            </motion.article>
        );
    }, [getItemQuantityInCart, isItemInCart, openModal, handleAddToCart, handleRemoveOneFromCart]);

    const cartSummaryDisplay = useMemo(() => (
        <motion.section 
            style={styles.cartSummary}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            aria-label="Shopping cart summary"
        >
            <div style={styles.cartSummaryFlex}>
                <div>
                    <h2>Cart Summary</h2>
                    <p>Total Items: <strong>{totalItemsInCart}</strong></p>
                    <p>Total Value: <strong>₦{cartTotal.toLocaleString()}</strong></p>
                </div>
            </div>
            
            {cartItems.length > 0 && (
                <div>
                    <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Items in Cart:</h3>
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
        </motion.section>
    ), [cartItems, totalItemsInCart, cartTotal]);

    return (
        <>
            <Head>
                <title>Blacksfit - Nigerian Urban Fashion | Streetwear Clothing Lagos</title>
                <meta 
                    name="description" 
                    content="Blacksfit: Premium Nigerian streetwear brand. Shop our Lagos-inspired urban fashion collection - high-quality, limited edition pieces for men and women. Free shipping in Nigeria." 
                />
                <meta name="keywords" content="nigerian streetwear, lagos fashion, blacksfit clothing, african urban wear, premium streetwear, nigerian clothing brand, lagos street fashion, african designer clothes" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:title" content="Blacksfit | Premium Nigerian Streetwear & Urban Fashion" />
                <meta property="og:description" content="Lagos-inspired urban fashion collection - high-quality, limited edition pieces for men and women." />
                <meta property="og:image" content="https://blacksfit-test.vercel.app/images/social-preview.jpg" />
                <meta property="og:url" content="https://blacksfit-test.vercel.app" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Blacksfit | Premium Nigerian Streetwear & Urban Fashion" />
                <meta name="twitter:description" content="Lagos-inspired urban fashion collection - high-quality, limited edition pieces for men and women." />
                <meta name="twitter:image" content="https://blacksfit-test.vercel.app/images/social-preview.jpg" />
                <meta name="twitter:site" content="@blacksfit" />
                <link rel="canonical" href="https://blacksfit-test.vercel.app" />
                <link rel="alternate" hrefLang="en-ng" href="https://blacksfit-test.vercel.app" />
                
                <meta name="geo.region" content="NG-LA" />
                <meta name="geo.placename" content="Lagos" />
                <meta name="geo.position" content="6.524379;3.379206" />
                <meta name="ICBM" content="6.524379, 3.379206" />
                
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "Blacksfit",
                        "url": "https://blacksfit-test.vercel.app",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://blacksfit-test.vercel.app/search?q={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    })}
                </script>
                
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Blacksfit",
                        "url": "https://blacksfit-test.vercel.app",
                        "logo": "https://blacksfit-test.vercel.app/logo.png",
                        "sameAs": [
                            "https://www.instagram.com/blacksfit",
                            "https://www.facebook.com/blacksfit",
                            "https://twitter.com/blacksfit"
                        ],
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "123 Fashion Street",
                            "addressLocality": "Lagos",
                            "addressRegion": "LA",
                            "postalCode": "101233",
                            "addressCountry": "NG"
                        }
                    })}
                </script>
                
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [{
                            "@type": "Question",
                            "name": "Where is Blacksfit located?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Blacksfit is a Nigerian urban fashion brand based in Lagos, creating premium streetwear inspired by Nigerian culture."
                            }
                        }, {
                            "@type": "Question",
                            "name": "What payment methods do you accept?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We accept all major credit cards, bank transfers, and payment through Flutterwave for Nigerian customers."
                            }
                        }, {
                            "@type": "Question",
                            "name": "Do you offer international shipping?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Currently we ship within Nigeria with free delivery. International shipping options coming soon."
                            }
                        }]
                    })}
                </script>
            </Head>

            <div style={styles.container} itemScope itemType="https://schema.org/WebPage">
                <nav aria-label="Breadcrumb" style={styles.breadcrumb} itemScope itemType="https://schema.org/BreadcrumbList">
                    <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <Link href="/" style={styles.breadcrumbLink} itemProp="item">
                            <span itemProp="name">Home</span>
                            <meta itemProp="position" content="1" />
                        </Link>
                    </span>
                    <span style={styles.breadcrumbSeparator}>/</span>
                    <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <span itemProp="name">Shop</span>
                        <meta itemProp="position" content="2" />
                    </span>
                </nav>
                
                <BlacksfitBanner/>
                
                {modal && selectedProduct && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={handleBackdropClick}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 relative">
                            <button
                                onClick={closeModal}
                                className="text-red-500 text-2xl absolute top-2 right-2 hover:text-red-700"
                                aria-label="Close product details"
                            >
                                ×
                            </button>
                            
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="md:w-1/2">
                                    <Image 
                                        src={selectedProduct.fullimage || selectedProduct.photoUrl}
                                        width={500}
                                        height={400}
                                        alt={`Detailed view of ${selectedProduct.name} by Blacksfit`}
                                        className="w-full h-auto rounded-lg"
                                        style={{ objectFit: 'cover' }}
                                        placeholder="blur"
                                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                    />
                                </div>
                                
                                <div className="md:w-1/2">
                                    <div className="mt-0 md:mt-4">
                                        <h1 id="modal-title" className="text-xl font-bold text-gray-800 mb-2">
                                            {selectedProduct.name}
                                        </h1>
                                        <p className="text-gray-600 mb-2">Size: {selectedProduct.size}</p>
                                        <p className="text-blue-600 font-bold text-lg mb-4">
                                            ₦{selectedProduct.price.toLocaleString()}
                                        </p>
                                        {selectedProduct.description && (
                                            <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
                                        )}
                                        <p className="text-gray-700 mb-4">
                                            This limited edition piece is part of our Lagos-inspired collection. 
                                            Each Blacksfit item is crafted with premium materials for comfort and style.
                                        </p>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-2 mt-4">
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
                        </div>
                    </div>
                )}

                {cartSummaryDisplay}
                
                <main style={styles.productsSection}>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        style={styles.sectionTitle}
                    >
                        Our Latest Collection ({products.length} Items)
                    </motion.h1>
                    
                    <section 
                        style={styles.productsGridContainer} 
                        ref={productsContainerRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        aria-label="Product carousel"
                    >
                        <div style={styles.productsGrid} role="list">
                            {products.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </div>
                    </section>

                    <div style={styles.scrollButtonsContainer}>
                        <button 
                            onClick={scrollLeft}
                            style={styles.scrollButton}
                            aria-label="Scroll products left"
                        >
                            <span style={styles.scrollIcon}>←</span>
                        </button>
                        <button 
                            onClick={scrollRight}
                            style={styles.scrollButton}
                            aria-label="Scroll products right"
                        >
                            <span style={styles.scrollIcon}>→</span>
                        </button>
                    </div>
                </main>

            </div>
        </>
    );
};

export default Home;