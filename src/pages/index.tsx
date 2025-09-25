import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from '../comps/hooks';
import { setProducts } from '../comps/productSlice';
import { addToCart, decrementFromCart } from '../comps/cartSlice';
import { productData } from '../comps/productData';
import BlacksfitBanner from '@/comps/bg';


const generateProductSchema = (product: any) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": "https://tinyurl.com/vvvhvp7a",
    "description": `Limited edition ${product.name} by Blacksfit - Premium Nigerian urban fashion streetwear. Size ${product.size}. Handcrafted in Lagos with premium materials.`,
    "sku": `BLK-${product.id.toString().padStart(4, '0')}`,
    "mpn": `BLK-${product.id.toString().padStart(4, '0')}`,
    "brand": {
        "@type": "Brand",
        "name": "Blacksfit",
        "logo": "https://tinyurl.com/vvvhvp7a",
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
        "url": `https://blacksfit.com/shop/${product.id}`,
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
    const [modal, setModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // Initialize products
    useEffect(() => {
        if (products.length === 0) {
            dispatch(setProducts(productData));
        }
    }, [dispatch, products.length]);

    // Scroll handlers
    const handleScrollLeft = useCallback(() => {
        if (productsContainerRef.current) {
            const container = productsContainerRef.current;
            const cardWidth = 280 + 24;
            const scrollAmount = Math.min(cardWidth * 2, container.scrollLeft);
            
            container.scrollTo({
                left: container.scrollLeft - scrollAmount,
                behavior: 'smooth'
            });
        }
    }, []);

    const handleScrollRight = useCallback(() => {
        if (productsContainerRef.current) {
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
        }
    }, []);

    // Scroll position tracking
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
        };
    }, []);

    // Modal handlers
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

    // Cart calculations
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

    // Product card component
    const ProductCard = useCallback(({ product, index }: { product: any, index: number }) => {
        const quantityInCart = getItemQuantityInCart(product.id);
        const inCart = isItemInCart(product.id);

        return (
            <motion.article 
                key={product.id}
                className={`bg-black-900 p-6 rounded-xl border border-gray-700 shadow-lg transition-all ${
                    inCart ? 'border-blue-500 shadow-blue-500/30' : ''
                }`}
                style={{ width: '280px', flexShrink: 0 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                itemScope
                itemType="https://schema.org/Product"
            >
                <script type="application/ld+json">
                    {JSON.stringify(generateProductSchema(product))}
                </script>

                {inCart && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        In Cart: {quantityInCart}
                    </div>
                )}

                <h3 className="text-white text-lg font-bold truncate" itemProp="name">{product.name}</h3>
                <p className="text-gray-400 text-sm">Size: <span itemProp="size">{product.size}</span></p>
                <p className="text-blue-500 font-bold" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    ₦<span itemProp="price">{product.price.toLocaleString()}</span>
                    <meta itemProp="priceCurrency" content="NGN" />
                </p>

                <div 
                    className="relative h-48 mb-4 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => openModal(product)}
                >
                    <Image 
                        src={product.photoUrl}
                        fill
                        alt={`${product.name} - Nigerian Streetwear by Blacksfit | Premium Urban Fashion from Lagos`}
                        title={`Buy ${product.name} - Limited Edition | Blacksfit Official Store`}
                        className={`object-cover transition-all ${
                            inCart ? 'grayscale-0' : 'grayscale-20'
                        }`}
                        priority={index < 4}
                        quality={index < 4 ? 80 : 65}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        loading={index > 3 ? "lazy" : "eager"}
                        itemProp="image"
                    />
                </div>

                <div className="flex gap-3 mt-4">
                    <motion.button
                        onClick={() => handleAddToCart(product.id)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Add ${product.name} to cart`}
                    >
                        Add to Cart
                    </motion.button>

                    {inCart && (
                        <motion.button
                            onClick={() => handleRemoveOneFromCart(product.id)}
                            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-bold"
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

    // Cart summary display
    const cartSummaryDisplay = (
        <motion.section 
            className="bg-black-900 m-8 p-6 border border-gray-700 rounded-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            aria-label="Shopping cart summary"
        >
            <div className="flex gap-5 flex-wrap">
                <div>
                    <h2>Cart Summary</h2>
                    <p>Total Items: <strong>{totalItemsInCart}</strong></p>
                    <p>Total Value: <strong>₦{cartTotal.toLocaleString()}</strong></p>
                </div>
            </div>
            
            {cartItems.length > 0 && (
                <div>
                    <h3 className="font-medium mt-4 mb-2">Items in Cart:</h3>
                    <div className="flex flex-wrap gap-2">
                        {cartItems.map(item => (
                            <span 
                                key={item.id}
                                className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {item.name} x{item.quantity}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </motion.section>
    );

    // Modal body overflow control
    useEffect(() => {
        if (modal) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'auto';
            };
        }
    }, [modal]);

    return (
        <>
            <Head>
                <title>Blacksfit - Premium Nigerian Streetwear & Urban Fashion | Lagos</title>
                <meta 
                    name="description" 
                    content="Blacksfit: Nigeria's leading urban fashion brand. Shop exclusive Lagos-inspired streetwear - limited edition hoodies, tees & more. Free shipping nationwide." 
                />
                <meta name="keywords" content="nigerian streetwear, lagos fashion, blacksfit clothing, african urban wear, premium streetwear nigeria, lagos clothing brand, nigerian urban fashion, african designer clothes, buy nigerian fashion online" />
                <link rel="canonical" href="https://blacksfit.com" />
                <link rel="icon" href="https://tinyurl.com/vvvhvp7a" type="image/png" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://blacksfit.com" />
                <meta property="og:title" content="Blacksfit | Premium Nigerian Streetwear & Urban Fashion" />
                <meta property="og:description" content="Nigeria's leading urban fashion brand with Lagos-inspired streetwear collections. Free nationwide delivery." />
                <meta property="og:image" content="https://blacksfit.com/images/social-preview.jpg" />
                <meta property="og:locale" content="en_NG" />
                <meta property="og:site_name" content="Blacksfit" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@blacksfit08" />
                <meta name="twitter:creator" content="@blacksfit08" />
                <meta name="twitter:title" content="Blacksfit | Premium Nigerian Streetwear & Urban Fashion" />
                <meta name="twitter:description" content="Nigeria's leading urban fashion brand with Lagos-inspired streetwear collections. Free nationwide delivery." />
                <meta name="twitter:image" content="https://blacksfit.com/images/social-preview.jpg" />

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
                        "url": "https://blacksfit.com",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://blacksfit.com/search?q={search_term_string}",
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
                        "url": "https://blacksfit.com",
                        "logo": "https://tinyurl.com/vvvhvp7a",
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
                        "url": "https://blacksfit.com",
                        "breadcrumb": {
                            "@type": "BreadcrumbList",
                            "itemListElement": [{
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://blacksfit.com"
                            }, {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "shop",
                                "item": "https://blacksfit.com/shop"
                            }]
                        },
                        "inLanguage": "en-NG",
                        "potentialAction": {
                            "@type": "ReadAction",
                            "target": ["https://blacksfit.com"]
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

            <div className="bg-black text-white min-h-screen pb-8" itemScope itemType="https://schema.org/WebPage">
                <BlacksfitBanner />
                
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
                                <div className="md:w-1/2">
                                    <Image 
                                        src={selectedProduct.fullimage || selectedProduct.photoUrl}
                                        width={500}
                                        height={400}
                                        alt={`Detailed view of ${selectedProduct.name} by Blacksfit - Nigerian streetwear`}
                                        className="w-full h-auto rounded-lg object-cover"
                                        priority
                                          loading="eager" 
                                        quality={85}
                                         fetchPriority="high"
                                    />
                                </div>
                                
                                <div className="md:w-1/2">
                                    <div className="mt-0 md:mt-4">
                                        <h1 id="modal-title" className="text-xl font-bold text-white-700 mb-2">
                                            {selectedProduct.name}
                                        </h1>
                                        <p className="text-gray-600 mb-2">Size: {selectedProduct.size}</p>
                                        <p className="text-blue-600 font-bold text-lg mb-4">
                                            ₦{selectedProduct.price.toLocaleString()}
                                        </p>
                                        <p className="text-white-700  mb-4">
                                            This limited edition piece is part of our Lagos-inspired collection, 
                                            crafted with premium materials for the Nigerian climate. Each Blacksfit 
                                            item is designed for comfort and style in urban environments, with 
                                            attention to detail that reflects Nigerian street culture.
                                        </p>
                                        <p className="text-white-700  mb-4">
                                            <strong>Material:</strong> Premium cotton blend<br/>
                                            <strong>Care Instructions:</strong> Machine wash cold, tumble dry low<br/>
                                            <strong>Delivery:</strong> lagos delivery in 24-48 hours<br/> outside lagos 3-5 days<br/>
                                        </p>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-2 mt-4 sticky bottom-0 bg-black pt-4">
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
                
                <main className="p-8 max-w-full overflow-hidden relative">
                    <motion.h1 
                        className="text-2xl font-bold mb-6 pl-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Our Latest Collection ({products.length})
                    </motion.h1>
                    
                     <h2 className="text-xl font-semibold"> swipe left</h2>
                    <section 
                        className="overflow-x-auto p-4 scroll-smooth scrollbar-hide"
                        ref={productsContainerRef}
                        aria-label="Product carousel"
                    > 
                   
                        <div className="flex gap-6 mt-4 w-max" role="list">
                            {products.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </div>
                    </section>

                    <div className="flex justify-center gap-4 mt-4">
                        <button 
                            onClick={handleScrollLeft}
                            className={`bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center ${
                                isAtStart ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label="Scroll products left"
                            disabled={isAtStart}
                        >
                            ←
                        </button>
                        <button 
                            onClick={handleScrollRight}
                            className={`bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center ${
                                isAtEnd ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label="Scroll products right"
                            disabled={isAtEnd}
                        >
                            →
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
};

export default HomePage;