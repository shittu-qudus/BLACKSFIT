'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Package, Truck, RefreshCw, CreditCard, Shirt, Users } from 'lucide-react';

const BlacksfitFAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (itemIndex: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemIndex)) {
      newOpenItems.delete(itemIndex);
    } else {
      newOpenItems.add(itemIndex);
    }
    setOpenItems(newOpenItems);
  };

  const faqCategories = [
    {
      title: "Ordering & Payment",
      icon: <CreditCard className="w-6 h-6" />,
      items: [
        {
          question: "How do I place an order?",
          answer: "Simply browse our collection, select your preferred items and sizes, add them to your cart, and proceed to checkout. We accept all major credit cards, PayPal, and other secure payment methods."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and bank transfers. All transactions are secured with 256-bit SSL encryption."
        },
        {
          question: "Can I modify or cancel my order after placing it?",
          answer: "Orders can be modified or cancelled within 2 hours of placement. After this window, orders enter our fulfillment process and cannot be changed. Please contact our customer service immediately if you need assistance."
        },
        {
          question: "Do you offer payment plans or financing?",
          answer: "Yes! We partner with leading financing providers to offer flexible payment options. You can split your purchase into 4 interest-free installments or choose extended payment plans at checkout."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: <Truck className="w-6 h-6" />,
      items: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 3-7 business days within Nigeria, 7-14 days internationally. Express shipping (1-3 days) and overnight delivery options are also available at checkout."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes! We ship worldwide to over 100 countries. International shipping rates and delivery times vary by destination. Customs duties and taxes may apply depending on your country's regulations."
        },
        {
          question: "How can I track my order?",
          answer: "Once your order ships, you'll receive a tracking number via email and SMS. You can track your package in real-time through our website or the courier's tracking portal."
        },
        {
          question: "What if my package is lost or damaged?",
          answer: "We take full responsibility for lost or damaged packages. Contact us immediately with your order number, and we'll either resend your items or provide a full refund within 24 hours."
        }
      ]
    },
    {
      title: "Sizing & Fit",
      icon: <Shirt className="w-6 h-6" />,
      items: [
        {
          question: "How do I find my perfect size?",
          answer: "Use our detailed size guide available on each product page. We provide measurements in both centimeters and inches. For the best fit, measure yourself and compare with our size charts rather than relying on your usual size from other brands."
        },
        {
          question: "What if the item doesn't fit?",
          answer: "No worries! We offer free size exchanges within 30 days. The item must be unworn, unwashed, and have all original tags attached. We'll cover the return shipping cost for size exchanges."
        },
        {
          question: "Are your sizes true to standard sizing?",
          answer: "Our sizes are designed to fit true to size, but we recommend checking our specific size guide as fits can vary between different styles and collections. When in doubt, size up for a more relaxed fit."
        },
        {
          question: "Do you offer custom sizing or alterations?",
          answer: "Currently, we don't offer custom sizing, but we're working on expanding this service. Our standard sizes are designed to accommodate a wide range of body types with comfortable, stylish fits."
        }
      ]
    },
    {
      title: "Returns & Exchanges",
      icon: <RefreshCw className="w-6 h-6" />,
      items: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy from the date of delivery. Items must be unworn, unwashed, and in original condition with all tags attached. Returns are free for defective items; other returns may incur a small processing fee."
        },
        {
          question: "How do I return an item?",
          answer: "Visit our returns portal on the website, enter your order number, select the items you want to return, and print the prepaid return label. Drop off the package at any authorized courier location."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 3-5 business days after we receive your returned items. The refund will appear on your original payment method within 5-10 business days, depending on your bank."
        },
        {
          question: "Can I exchange for a different item?",
          answer: "Direct item exchanges aren't available, but you can return your item for a refund and place a new order for the item you prefer. This ensures you get exactly what you want without delays."
        }
      ]
    },
    {
      title: "Product Care",
      icon: <Package className="w-6 h-6" />,
      items: [
        {
          question: "How should I care for my Blacksfit clothing?",
          answer: "Each item comes with specific care instructions on the label. Generally, we recommend washing in cold water, turning items inside out, and air drying to maintain quality and color. Avoid bleach and high heat."
        },
        {
          question: "Are your products pre-shrunk?",
          answer: "Yes, all our cotton and cotton-blend items are pre-shrunk during manufacturing. However, we still recommend following care instructions carefully to maintain the perfect fit and appearance."
        },
        {
          question: "What materials do you use?",
          answer: "We use premium quality materials including 100% cotton, cotton blends, polyester, and sustainable fabrics. Each product page lists the exact material composition and care requirements."
        },
        {
          question: "How do I remove stains from my Blacksfit items?",
          answer: "For best results, treat stains immediately with cold water. For tougher stains, use a gentle stain remover before washing. Avoid harsh chemicals that might damage the fabric or fade the colors."
        }
      ]
    },
    {
      title: "About Blacksfit",
      icon: <Users className="w-6 h-6" />,
      items: [
        {
          question: "What makes Blacksfit different?",
          answer: "Blacksfit represents more than just clothing—we embody the relentless African spirit. Our designs celebrate Black excellence, Nigerian pride, and the hustle mentality. Every piece is crafted for those who never stop grinding."
        },
        {
          question: "Do you have physical stores?",
          answer: "Currently, we operate primarily online to serve customers worldwide. However, we do have pop-up events and collaborations in major Nigerian cities. Follow our social media for announcements about physical locations and events."
        },
        {
          question: "How can I stay updated on new releases?",
          answer: "Subscribe to our newsletter, follow us on social media (@blacksfit), and enable push notifications on our website. VIP members get early access to new collections and exclusive discounts."
        },
        {
          question: "Do you collaborate with influencers or offer sponsorships?",
          answer: "Yes! We're always looking to partner with individuals who embody the Blacksfit spirit. Email partnerships@blacksfit.com with your proposal, social media stats, and why you align with our brand values."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white text-black py-20 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-black mb-6"
          >
            FAQ
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl font-light max-w-2xl mx-auto"
          >
            Everything you need to know about <strong>Blacksfit</strong>
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-24 h-1 bg-black mx-auto mt-8"
          />
        </div>
      </motion.div>

      {/* FAQ Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
              className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white text-black rounded-full">
                  {category.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">{category.title}</h2>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const globalIndex = `${categoryIndex}-${itemIndex}`;
                  const isOpen = openItems.has(globalIndex);
                  
                  return (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (categoryIndex * 0.1) + (itemIndex * 0.05), duration: 0.5 }}
                      className="border border-gray-700 rounded-lg overflow-hidden hover:border-gray-500 transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-300"
                      >
                        <span className="text-lg font-semibold pr-4 text-white">{item.question}</span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown className="w-5 h-5 text-white" />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-5 pt-2 text-gray-300 leading-relaxed">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 text-center bg-white text-black rounded-2xl p-12"
        >
          <h3 className="text-3xl font-bold mb-4">Still have questions?</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our customer service team is here to help. 
            We respond to all inquiries within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
            >
              Contact Support
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-black text-black font-semibold rounded-full hover:bg-black hover:text-white transition-all"
            >
              Live Chat
            </motion.button>
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 text-lg italic">
            #No sleep, just grind. - <strong>Blacksfit</strong>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BlacksfitFAQ;