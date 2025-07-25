// components/PaystackCheckout.tsx
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../comps/hooks';
import { clearCart } from '../comps/cartSlice';
import emailjs from 'emailjs-com';

declare global {
  interface Window {
    PaystackPop?: {
      setup(config: PaystackSetupConfig): PaystackHandler;
    };
  }
}

// Define the Paystack response type
interface PaystackResponse {
    reference: string;
    status: string;
    trans: string;
    transaction: string;
    trxref: string;
    message: string;
}

// Define customer details interface
interface CustomerDetails {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
}

// Define Paystack types
interface PaystackHandler {
    openIframe(): void;
}

interface PaystackSetupConfig {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    firstname: string;
    lastname: string;
    phone: string;
    metadata?: {
        custom_fields: Array<{
            display_name: string;
            variable_name: string;
            value: string;
        }>;
    };
    callback: (response: PaystackResponse) => void;
    onClose: () => void;
}

const PaystackCheckout: React.FC = () => {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(state => state.cart.items);
    const cartTotal = useAppSelector(state => state.cart.total);
    
    const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: ''
    });
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [paystackLoaded, setPaystackLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [emailStatus, setEmailStatus] = useState<string>(''); // Debug email status

    // IMPORTANT: Replace with your actual PUBLIC key (starts with pk_test_)
    const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!;
    
    // EmailJS configuration - replace with your actual values
    const EMAILJS_SERVICE_ID = 'service_830xn5m';
    const EMAILJS_TEMPLATE_ID = 'template_mazc7pm';
    const EMAILJS_USER_ID = '58om_daVBcallUF97b';

    // Initialize EmailJS
    useEffect(() => {
        try {
            emailjs.init(EMAILJS_USER_ID);
            console.log('EmailJS initialized successfully');
        } catch (error) {
            console.error('EmailJS initialization failed:', error);
        }
    }, []);

    // Check if Paystack script is loaded
    useEffect(() => {
        const checkPaystackLoaded = () => {
            if (window.PaystackPop) {
                console.log('Paystack already loaded');
                setPaystackLoaded(true);
                setIsLoading(false);
                return;
            }
            
            // If not loaded, try to load it dynamically
            const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
            if (existingScript) {
                console.log('Paystack script already in DOM, waiting for load...');
                return;
            }

            console.log('Loading Paystack script...');
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            script.onload = () => {
                console.log('Paystack script loaded successfully');
                // Wait a bit for PaystackPop to be available
                setTimeout(() => {
                    if (window.PaystackPop) {
                        setPaystackLoaded(true);
                        setIsLoading(false);
                    } else {
                        console.error('PaystackPop not available after script load');
                        setIsLoading(false);
                    }
                }, 100);
            };
            script.onerror = () => {
                console.error('Failed to load Paystack script');
                setIsLoading(false);
            };
            
            document.head.appendChild(script);
        };

        checkPaystackLoaded();

        return () => {
            // Cleanup: remove the script if component unmounts
            const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
            if (existingScript) {
                document.head.removeChild(existingScript);
            }
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCustomerDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const sendEmailNotification = async (orderDetails: PaystackResponse, customerInfo: CustomerDetails, items: any[], total: number) => {
        console.log('=== EmailJS Send Debug ===');
        console.log('EmailJS Service ID:', EMAILJS_SERVICE_ID);
        console.log('EmailJS Template ID:', EMAILJS_TEMPLATE_ID);
        console.log('EmailJS User ID:', EMAILJS_USER_ID);
        console.log('Customer Info:', customerInfo);
        console.log('Order Details:', orderDetails);
        console.log('Cart Items:', items);
        console.log('Cart Total:', total);

        setEmailStatus('Sending email...');

        try {
            // Prepare cart items as formatted string
            const cartItemsText = items.map(item => 
                `• ${item.name} (Qty: ${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}`
            ).join('\n');

            const templateParams = {
                to_name: customerInfo.firstName,
                to_email: customerInfo.email,
                customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
                customer_email: customerInfo.email,
                customer_phone: customerInfo.phone || 'Not provided',
                customer_address: customerInfo.address || 'Not provided',
                order_total: `₦${total.toLocaleString()}`,
                order_items: cartItemsText,
                transaction_reference: orderDetails.reference,
                payment_status: orderDetails.status,
                order_date: new Date().toLocaleDateString(),
                order_time: new Date().toLocaleTimeString(),
                // Additional fields that might be useful
                from_name: 'BlackFit Store',
                reply_to: 'noreply@blackfit.com'
            };

            console.log('Template Params:', templateParams);

            // Send email using emailjs.send method
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_USER_ID
            );
            
            console.log('EmailJS Response:', response);
            console.log('Email sent successfully with status:', response.status);
            setEmailStatus('Email sent successfully!');
            
            // Clear status after 3 seconds
            setTimeout(() => setEmailStatus(''), 3000);
            
        } catch (error: any) {
            console.error('=== EmailJS Error Details ===');
            console.error('Error:', error);
            console.error('Error message:', error?.message);
            console.error('Error text:', error?.text);
            console.error('Error status:', error?.status);
            
            setEmailStatus(`Email failed: ${error?.message || error?.text || 'Unknown error'}`);

            // Prepare cart items as formatted string (again, for alternative method)
            const cartItemsText = items.map(item => 
                `• ${item.name} (Qty: ${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}`
            ).join('\n');

            // Recreate templateParams for alternative method
            const templateParams = {
                to_name: customerInfo.firstName,
                to_email: customerInfo.email,
                customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
                customer_email: customerInfo.email,
                customer_phone: customerInfo.phone || 'Not provided',
                customer_address: customerInfo.address || 'Not provided',
                order_total: `₦${total.toLocaleString()}`,
                order_items: cartItemsText,
                transaction_reference: orderDetails.reference,
                payment_status: orderDetails.status,
                order_date: new Date().toLocaleDateString(),
                order_time: new Date().toLocaleTimeString(),
                from_name: 'BlackFit Store',
                reply_to: 'noreply@blackfit.com'
            };

            // Try alternative method if first fails
            if (error?.status === 400 || error?.status === 401) {
                console.log('Trying alternative EmailJS method...');
                try {
                    const altResponse = await emailjs.sendForm(
                        EMAILJS_SERVICE_ID,
                        EMAILJS_TEMPLATE_ID,
                        // Create a temporary form with the data
                        createTempForm(templateParams),
                        EMAILJS_USER_ID
                    );
                    console.log('Alternative method succeeded:', altResponse);
                    setEmailStatus('Email sent via alternative method!');
                } catch (altError) {
                    console.error('Alternative method also failed:', altError);
                    setEmailStatus(`Both email methods failed`);
                }
            }
            
            // Clear error after 5 seconds
            setTimeout(() => setEmailStatus(''), 5000);
        }
    };

    // Helper function to create temporary form for sendForm method
    const createTempForm = (data: any) => {
        const form = document.createElement('form');
        Object.keys(data).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
        });
        document.body.appendChild(form);
        
        // Remove form after a short delay
        setTimeout(() => {
            if (form.parentNode) {
                form.parentNode.removeChild(form);
            }
        }, 1000);
        
        return form;
    };

    const initializePaystack = () => {
        console.log('=== Paystack Initialization Debug ===');
        console.log('paystackLoaded:', paystackLoaded);
        console.log('window.PaystackPop:', window.PaystackPop);
        console.log('PAYSTACK_PUBLIC_KEY:', PAYSTACK_PUBLIC_KEY);
        console.log('customerDetails:', customerDetails);
        console.log('cartTotal:', cartTotal);
        console.log('cartItems:', cartItems);

        if (!paystackLoaded || !window.PaystackPop) {
            console.error('Paystack not loaded');
            alert('Payment system is not ready. Please refresh the page and try again.');
            return;
        }

        // Validate Paystack key
        if (!PAYSTACK_PUBLIC_KEY.startsWith('pk_')) {
            console.error('Invalid Paystack public key. Must start with pk_test_ or pk_live_');
            alert('Invalid Paystack configuration. Please contact support.');
            return;
        }

        // Validate required fields
        if (!customerDetails.email || !customerDetails.firstName || !customerDetails.lastName) {
            console.error('Missing required customer details');
            alert('Please fill in all required fields');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerDetails.email)) {
            console.error('Invalid email format');
            alert('Please enter a valid email address');
            return;
        }

        // Validate cart
        if (cartItems.length === 0 || cartTotal <= 0) {
            console.error('Invalid cart state');
            alert('Your cart is empty or invalid');
            return;
        }

        setIsProcessing(true);

        try {
            const paymentConfig = {
                key: PAYSTACK_PUBLIC_KEY,
                email: customerDetails.email.trim(),
                amount: Math.round(cartTotal * 100), // Ensure it's an integer in kobo
                currency: 'NGN',
                ref: `blackfit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // More unique reference
                firstname: customerDetails.firstName.trim(),
                lastname: customerDetails.lastName.trim(),
                phone: customerDetails.phone.trim() || '',
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Address",
                            variable_name: "address",
                            value: customerDetails.address.trim() || 'Not provided'
                        },
                        {
                            display_name: "Cart Items",
                            variable_name: "cart_items",
                            value: JSON.stringify(cartItems)
                        },
                        {
                            display_name: "Order Total",
                            variable_name: "order_total",
                            value: cartTotal.toString()
                        }
                    ]
                },
                callback: function(response: PaystackResponse) {
                    console.log('Payment callback triggered:', response);
                    
                    // Handle async operations without making the callback async
                    const handlePaymentSuccess = async () => {
                        try {
                            // Payment successful
                            console.log('Payment successful:', response);
                            
                            // Check payment status
                            if (response.status === 'success') {
                                console.log('Payment verified as successful, sending email...');
                                
                                // Store current state before clearing cart
                                const currentCustomerDetails = { ...customerDetails };
                                const currentCartItems = [...cartItems];
                                const currentCartTotal = cartTotal;
                                
                                // Send email notification with stored values
                                await sendEmailNotification(response, currentCustomerDetails, currentCartItems, currentCartTotal);
                                
                                // Clear cart after email is sent
                                dispatch(clearCart());
                                
                                // Show success message
                                alert(`Payment successful! Reference: ${response.reference}\nA confirmation email has been sent to ${currentCustomerDetails.email}`);
                                
                                // Reset form
                                setShowForm(false);
                                setCustomerDetails({
                                    email: '',
                                    firstName: '',
                                    lastName: '',
                                    phone: '',
                                    address: ''
                                });
                            } else {
                                console.log('Payment status not success:', response.status);
                                alert(`Payment status: ${response.status}. Please contact support if you were charged.`);
                            }
                            
                        } catch (error) {
                            console.error('Error in payment callback:', error);
                            alert('Payment successful but there was an error processing your order. Please contact support with reference: ' + response.reference);
                        } finally {
                            setIsProcessing(false);
                        }
                    };
                    
                    // Execute the async handler
                    handlePaymentSuccess();
                },
                onClose: function() {
                    console.log('Payment dialog closed by user');
                    setIsProcessing(false);
                }
            };

            console.log('Payment config:', paymentConfig);
            console.log('About to call PaystackPop.setup...');

            const handler = window.PaystackPop.setup(paymentConfig);
            
            console.log('Handler created:', handler);
            console.log('About to open iframe...');
            
            handler.openIframe();
            
            console.log('Iframe opened successfully'  );

        } catch (error: any) {
            console.error('Detailed error in initializePaystack:', error);
            console.error('Error name:', error?.name);
            console.error('Error message:', error?.message);
            console.error('Error stack:', error?.stack);
            
            // More specific error messages
            if (error?.message && error.message.includes('amount')) {
                alert('Invalid payment amount. Please refresh and try again.');
            } else if (error?.message && error.message.includes('email')) {
                alert('Invalid email address format.');
            } else if (error?.message && error.message.includes('key')) {
                alert('Payment configuration error. Please contact support.');
            } else {
                alert(`Payment initialization failed: ${error?.message || 'Unknown error'}. Please try again.`);
            }
            
            setIsProcessing(false);
        }
    };

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('Checkout form submitted');
        
        // Validate form
        if (!customerDetails.email || !customerDetails.firstName || !customerDetails.lastName) {
            alert('Please fill in all required fields');
            return;
        }

        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }

        if (!paystackLoaded) {
            alert('Payment system is still loading. Please wait a moment and try again.');
            return;
        }

        initializePaystack();
    };

    // Loading state
    if (isLoading) {
        return (
            <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                border: '1px solid #ddd', 
                borderRadius: '5px' 
            }}>
                <p>Loading payment system...</p>
            </div>
        );
    }

    // Paystack failed to load
    if (!paystackLoaded) {
        return (
            <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                backgroundColor: '#f8d7da',
                color: '#721c24'
            }}>
                <p>Failed to load payment system. Please refresh the page and try again.</p>
                <button 
                    onClick={() => window.location.reload()}
                    style={{
                        marginTop: '10px',
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                >
                    Refresh Page
                </button>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                border: '1px solid #ddd', 
                borderRadius: '5px' 
            }}>
                <p>Add items to cart to proceed with checkout</p>
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '5px', 
            margin: '20px 0' 
        }}>
            <h2>Checkout</h2>
            
            {/* Email Status Display */}
            {emailStatus && (
                <div style={{
                    padding: '10px',
                    margin: '10px 0',
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    backgroundColor: emailStatus.includes('failed') || emailStatus.includes('Error') ? '#f8d7da' : '#d4edda',
                    color: emailStatus.includes('failed') || emailStatus.includes('Error') ? '#721c24' : '#155724'
                }}>
                    {emailStatus}
                </div>
            )}
            
            {!showForm ? (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <h3>Order Summary</h3>
                        <p><strong>Items:</strong> {cartItems.length}</p>
                        <p><strong>Total:</strong> ₦{cartTotal.toLocaleString()}</p>
                    </div>
                    
                    <button 
                        onClick={() => setShowForm(true)}
                        style={{ 
                            padding: '12px 24px', 
                            backgroundColor: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Proceed to Payment
                    </button>
                </div>
            ) : (
                <div>
                    <h3>Customer Details</h3>
                    <form onSubmit={handleCheckout}>
                        <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={customerDetails.email}
                                    onChange={handleInputChange}
                                    required
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        border: '1px solid #ddd', 
                                        borderRadius: '3px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={customerDetails.firstName}
                                        onChange={handleInputChange}
                                        required
                                        style={{ 
                                            width: '100%', 
                                            padding: '10px', 
                                            border: '1px solid #ddd', 
                                            borderRadius: '3px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                                
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={customerDetails.lastName}
                                        onChange={handleInputChange}
                                        required
                                        style={{ 
                                            width: '100%', 
                                            padding: '10px', 
                                            border: '1px solid #ddd', 
                                            borderRadius: '3px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={customerDetails.phone}
                                    onChange={handleInputChange}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        border: '1px solid #ddd', 
                                        borderRadius: '3px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Delivery Address
                                </label>
                                <textarea
                                    name="address"
                                    value={customerDetails.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        border: '1px solid #ddd', 
                                        borderRadius: '3px',
                                        fontSize: '14px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                        </div>
                        
                        <div style={{ 
                            padding: '15px', 
                            backgroundColor: '#f8f9fa', 
                            borderRadius: '5px',
                            marginBottom: '20px'
                        }}>
                            <h4>Order Summary</h4>
                            {cartItems.map(item => (
                                <div key={item.id} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    marginBottom: '5px'
                                }}>
                                    <span className='text-black' >{item.name} x {item.quantity}</span>
                                    <span className='text-black'>₦{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                            <hr />
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                fontWeight: 'bold',
                                fontSize: '18px'
                            }}>
                                <span className='text-black'>Total:</span>
                                <span className='text-black' >₦{cartTotal.toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                type="button"
                                onClick={() => setShowForm(false)}
                                style={{ 
                                    padding: '12px 24px', 
                                    backgroundColor: '#6c757d', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Back
                            </button>
                            
                            <button 
                                type="submit"
                                disabled={isProcessing}
                                style={{ 
                                    padding: '12px 24px', 
                                    backgroundColor: isProcessing ? '#6c757d' : '#28a745', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '5px',
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    flex: 1
                                }}
                            >
                                {isProcessing ? 'Processing...' : `Pay ₦${cartTotal.toLocaleString()}`}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PaystackCheckout;