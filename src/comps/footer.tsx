// src/components/Footer.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInstagram, 
  faXTwitter, 
  faFacebook, 
  faTiktok,
  faYoutube 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faShippingFast,
  faUndo,
  faShieldAlt,
  faCreditCard
} from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Quick Links data with individual hrefs
  const quickLinks = [
    { name: 'New Arrivals', href: '/csoon' },
    { name: 'Best Sellers', href: '/csoon' },
    { name: 'Collections', href: '/csoon' },
    { name: 'Sale', href: '/sale' },
    { name: 'Gift Cards', href: '/csoon' },
    { name: 'Size Guide', href: '/csoon' },
    { name: 'Lookbook', href: '/csoon' },
    { name: 'Store Locator', href: '/csoon' }
  ];

  // Customer Care links with individual hrefs
  const customerCareLinks = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping Info', href: '/csoon' },
    { name: 'Returns & Exchanges', href: '/csoon' },
    { name: 'Size Chart', href: '/csoon' },
    { name: 'Care Instructions', href: '/csoon' },
    { name: 'Track Your Order', href: '/csoon' },
    { name: 'Customer Reviews', href: '/csoon' }
  ];

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-wide">BLACKSFIT</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover premium fashion that defines your style. From streetwear to 
              luxury pieces, we curate collections that speak to the modern trendsetter.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://www.instagram.com/blacks_fit?igsh=bmhza3FyeWYxb3M2&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <FontAwesomeIcon icon={faInstagram} size="sm" />
              </a>
              <a
                href="https://x.com/blacksfit08?s=21"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-900 hover:scale-110 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faXTwitter} size="sm" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faFacebook} size="sm" />
              </a>
              <a
                href="https://www.tiktok.com/@blacksfitt08?_t=ZM-8xWIqa0KHn3&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-900 hover:scale-110 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faTiktok} size="sm" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 hover:scale-110 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faYoutube} size="sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Customer Care</h4>
            <ul className="space-y-2">
              {customerCareLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                <span className="text-gray-400 text-sm">
                mowe ogun state
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                <span className="text-gray-400 text-sm">+234 (0) 800 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                <span className="text-gray-400 text-sm">Blacksfit08@gmail.com</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="pt-4">
              <h5 className="text-sm font-semibold text-white mb-2">Stay Updated</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white"
                />
                <button className="px-4 py-2 bg-white text-black rounded-r-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faShippingFast} className="text-white text-xl" />
              <div>
                <h6 className="text-sm font-semibold text-white">Get your order fast with our speedy shipping options!</h6>
                {/* <p className="text-xs text-gray-400">On orders over ₦50,000</p> */}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faUndo} className="text-white text-xl" />
              <div>
                <h6 className="text-sm font-semibold text-white">Easy Returns</h6>
                <p className="text-xs text-gray-400">3-7day return policy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faShieldAlt} className="text-white text-xl" />
              <div>
                <h6 className="text-sm font-semibold text-white">Secure Payment</h6>
                <p className="text-xs text-gray-400">SSL encrypted checkout</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faCreditCard} className="text-white text-xl" />
              <div>
                <h6 className="text-sm font-semibold text-white">Flexible Payment</h6>
                <p className="text-xs text-gray-400">Multiple payment options</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-gray-400">
                &copy; {currentYear} BLACKSFIT. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <a href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="/cookie-policy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                  Cookie Policy
                </a>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400">We Accept:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-xs flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-8 h-5 bg-green-600 rounded text-xs flex items-center justify-center font-bold">
                  PAY
                </div>
                <div className="w-8 h-5 bg-purple-600 rounded text-xs flex items-center justify-center font-bold">
                  FLW
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;