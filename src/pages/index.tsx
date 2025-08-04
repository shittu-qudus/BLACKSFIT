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
const LOGO:string = "/image/BLACKS.png"
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
        position: 'relative',
        scrollBehavior: 'smooth'
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
    scrollButtonDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed'
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
    modalDescription: {
        color: '#666',
        lineHeight: '1.6',
        marginBottom: '1rem'
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
    "image": LOGO,
    "description": `Limited edition ${product.name} by Blacksfit - Premium Nigerian urban fashion streetwear. Size ${product.size}. Handcrafted in Lagos with premium materials.`,
    "sku": `BLK-${product.id.toString().padStart(4, '0')}`,
    "mpn": `BLK-${product.id.toString().padStart(4, '0')}`,
    "brand": {
        "@type": "Brand",
        "name": "Blacksfit",
        "logo": `${LOGO}`,
        "description": "Premium Nigerian streetwear brand creating Lagos-inspired urban fashion"
    },
    "review": {
        "@type": "Review",
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": "4.8",
            "bestRating": "5"
        },
        "author": {
            "@type": "Person",
            "name": "Verified Buyer"
        },
        "reviewBody": "Excellent quality and perfect fit for Nigerian body types. The fabric is durable and comfortable for Lagos weather."
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "56",
        "bestRating": "5"
    },
    "offers": {
        "@type": "Offer",
        "url": `https://blacksfit-test.vercel.app/shop/${product.id}`,
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
            },
            "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 2,
                    "unitCode": "DAY"
                },
                "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 3,
                    "unitCode": "DAY"
                }
            }
        }
    },
    "additionalProperty": [{
        "@type": "PropertyValue",
        "name": "Material",
        "value": "Premium cotton blend"
    }, {
        "@type": "PropertyValue",
        "name": "Origin",
        "value": "Made in Nigeria"
    }, {
        "@type": "PropertyValue",
        "name": "Fit",
        "value": "Designed for Nigerian body types"
    }]
});

const HomePage = () => {
    const dispatch = useAppDispatch();
    const products = useAppSelector(state => state.products.products);
    const cartItems = useAppSelector(state => state.cart.items);
    const cartTotal = useAppSelector(state => state.cart.total);
    const productsContainerRef = useRef<HTMLDivElement>(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [modal, setModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(setProducts(productData));
        }
    }, [dispatch, products.length]);

    const handleScrollLeft = useCallback(() => {
        if (productsContainerRef.current) {
            setIsAutoScrolling(false);
            const container = productsContainerRef.current;
            const cardWidth = 280 + 24;
            const scrollAmount = Math.min(cardWidth * 2, container.scrollLeft);
            
            container.scrollTo({
                left: container.scrollLeft - scrollAmount,
                behavior: 'smooth'
            });

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            
            scrollTimeoutRef.current = setTimeout(() => {
                setIsAutoScrolling(true);
            }, 8000);
        }
    }, []);

    const handleScrollRight = useCallback(() => {
        if (productsContainerRef.current) {
            setIsAutoScrolling(false);
            const container = productsContainerRef.current;
            const cardWidth = 280 + 24;
            const maxScroll = container.scrollWidth - container.clientWidth;
            const scrollAmount = Math.min(
                cardWidth * 2,
                maxScroll - container.scrollLeft
            );
            
            container.scrollTo({
                left: container.scrollLeft + scrollAmount,
                behavior: 'smooth'
            });

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            
            scrollTimeoutRef.current = setTimeout(() => {
                setIsAutoScrolling(true);
            }, 8000);
        }
    }, []);

    useEffect(() => {
        const container = productsContainerRef.current;
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
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isAutoScrolling) return;
        
        const container = productsContainerRef.current;
        if (!container) return;

        let scrollPosition = container.scrollLeft;
        let direction = 1;
        const scrollSpeed = 0.5;
        let animationFrameId: number;

        const autoScroll = () => {
            if (!isAutoScrolling || !container) return;
            
            scrollPosition += scrollSpeed * direction;
            container.scrollLeft = scrollPosition;

            const maxScroll = container.scrollWidth - container.clientWidth;
            if (scrollPosition >= maxScroll) {
                direction = -1;
            } else if (scrollPosition <= 0) {
                direction = 1;
            }

            animationFrameId = requestAnimationFrame(autoScroll);
        };

        animationFrameId = requestAnimationFrame(autoScroll);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isAutoScrolling]);

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
                        alt={`${product.name} - Nigerian Streetwear by Blacksfit | Premium Urban Fashion from Lagos`}
                        title={`Buy ${product.name} - Limited Edition | Blacksfit Official Store`}
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
                <title>Blacksfit - Premium Nigerian Streetwear & Urban Fashion | Lagos</title>
                <meta 
                    name="description" 
                    content="Blacksfit: Nigeria's leading urban fashion brand. Shop exclusive Lagos-inspired streetwear - limited edition hoodies, tees & more. Free shipping nationwide." 
                />
                <meta name="keywords" content="nigerian streetwear, lagos fashion, blacksfit clothing, african urban wear, premium streetwear nigeria, lagos clothing brand, nigerian urban fashion, african designer clothes, buy nigerian fashion online" />
                <link rel="canonical" href="https://blacksfit-test.vercel.app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://blacksfit-test.vercel.app" />
                <meta property="og:title" content="Blacksfit | Premium Nigerian Streetwear & Urban Fashion" />
                <meta property="og:description" content="Nigeria's leading urban fashion brand with Lagos-inspired streetwear collections. Free nationwide delivery." />
                <meta property="og:image" content="https://blacksfit-test.vercel.app/images/social-preview.jpg" />
                <meta property="og:locale" content="en_NG" />
                <meta property="og:site_name" content="Blacksfit" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@blacksfit08" />
                <meta name="twitter:creator" content="@blacksfit08" />
                <meta name="twitter:title" content="Blacksfit | Premium Nigerian Streetwear & Urban Fashion" />
                <meta name="twitter:description" content="Nigeria's leading urban fashion brand with Lagos-inspired streetwear collections. Free nationwide delivery." />
                <meta name="twitter:image" content="https://blacksfit-test.vercel.app/images/social-preview.jpg" />

                {/* Geo Tags */}
                <meta name="geo.region" content="NG-LA" />
                <meta name="geo.placename" content="Lagos, Nigeria" />
                <meta name="geo.position" content="6.524379;3.379206" />
                <meta name="ICBM" content="6.524379, 3.379206" />
                <meta name="country" content="Nigeria" />
                <meta name="city" content="Lagos" />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/icon.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/site.webmanifest" />

                {/* Preload critical resources */}
                <link rel="preload" href="/fonts/your-font.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                
                {/* JSON-LD Structured Data */}
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
                        },
                        "inLanguage": "en-NG"
                    })}
                </script>
                
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Blacksfit",
                        "url": "https://blacksfit-test.vercel.app",
                        "logo": "https://blacksfit-test.vercel.app/BLACKS.png",
                        "description": "Premium Nigerian streetwear brand creating Lagos-inspired urban fashion",
                        "foundingDate": "2020",
                        "founders": [{
                            "@type": "Person",
                            "name": "Founder Name"
                        }],
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "9 IDAHOSA",
                            "addressLocality": "MOWE",
                            "addressRegion": "OGUN",
                            "postalCode": "110113",
                            "addressCountry": "NG"
                        },
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "contactType": "customer service",
                            "email": "info@blacksfit.com",
                            "telephone": "+2348012345678"
                        },
                        "sameAs": [
                            "https://www.instagram.com/blacks_fit",
                            "https://www.tiktok.com/@blacksfitt08",
                            "https://twitter.com/blacksfit08",
                            "https://www.facebook.com/blacksfitofficial",
                            "https://www.pinterest.com/blacksfit"
                        ]
                    })}
                </script>
                
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Blacksfit - Premium Nigerian Streetwear",
                        "description": "Nigeria's leading urban fashion brand with Lagos-inspired streetwear collections",
                        "url": "https://blacksfit-test.vercel.app",
                        "breadcrumb": {
                            "@type": "BreadcrumbList",
                            "itemListElement": [{
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://blacksfit-test.vercel.app"
                            }, {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "shop",
                                "item": "https://blacksfit-test.vercel.app/shop"
                            }]
                        },
                        "inLanguage": "en-NG",
                        "potentialAction": {
                            "@type": "ReadAction",
                            "target": ["https://blacksfit-test.vercel.app"]
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
                                "text": "Blacksfit is a Nigerian urban fashion brand based in Lagos, creating premium streetwear inspired by Nigerian urban culture and lifestyle."
                            }
                        }, {
                            "@type": "Question",
                            "name": "What payment methods do you accept?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We accept all major payment methods including credit/debit cards, bank transfers, USSD, and payment through Flutterwave for Nigerian customers."
                            }
                        }, {
                            "@type": "Question",
                            "name": "Do you offer international shipping?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Currently we offer free nationwide shipping within Nigeria. International shipping to other African countries is coming soon."
                            }
                        }, {
                            "@type": "Question",
                            "name": "What makes Blacksfit different from other Nigerian brands?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Blacksfit combines premium quality materials with authentic Lagos-inspired designs, offering limited edition pieces that celebrate Nigerian urban culture."
                            }
                        }, {
                            "@type": "Question",
                            "name": "How long does delivery take in Lagos?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Most orders in Lagos are delivered within 24-48 hours. We offer same-day delivery for orders placed before 12pm in select Lagos areas."
                            }
                        }]
                    })}
                </script>
            </Head>

            <div style={styles.container} itemScope itemType="https://schema.org/WebPage">
                
                
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
                                        alt={`Detailed view of ${selectedProduct.name} by Blacksfit - Nigerian streetwear`}
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
                                        <p style={styles.modalDescription}>
                                            This limited edition piece is part of our Lagos-inspired collection, 
                                            crafted with premium materials for the Nigerian climate. Each Blacksfit 
                                            item is designed for comfort and style in urban environments, with 
                                            attention to detail that reflects Nigerian street culture.
                                        </p>
                                        <p style={styles.modalDescription}>
                                            <strong>Material:</strong> Premium cotton blend<br/>
                                            <strong>Care Instructions:</strong> Machine wash cold, tumble dry low<br/>
                                            <strong>Delivery:</strong> Free nationwide shipping (1-3 business days in Lagos)
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
                    <motion.h1 className="sm:text-2xl text-xl font-bold"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        style={styles.sectionTitle}
                    >
                       <span className="sm:text-sm text-xl font-bold"> Our Latest Collection ({products.length})</span>
                    </motion.h1>
                    
                    <section 
                        style={styles.productsGridContainer} 
                        ref={productsContainerRef}
                        onMouseEnter={() => setIsAutoScrolling(false)}
                        onMouseLeave={() => setIsAutoScrolling(true)}
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
                            onClick={handleScrollLeft}
                            style={{
                                ...styles.scrollButton,
                                ...(isAtStart && styles.scrollButtonDisabled)
                            }}
                            aria-label="Scroll products left"
                            disabled={isAtStart}
                        >
                            <span style={styles.scrollIcon}>←</span>
                        </button>
                        <button 
                            onClick={handleScrollRight}
                            style={{
                                ...styles.scrollButton,
                                ...(isAtEnd && styles.scrollButtonDisabled)
                            }}
                            aria-label="Scroll products right"
                            disabled={isAtEnd}
                        >
                            <span style={styles.scrollIcon}>→</span>
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
};

export default HomePage;