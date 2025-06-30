// components/Header.js or Header.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { FaShoppingCart } from "react-icons/fa";
import { useAppSelector } from './hooks';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useAppSelector(state => state.cart.items);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-black text-white px-4 py-3 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">
          <Image
            alt="cover pic"
            src="/image/logo.jpg"
            height={20}
            width={20}
            priority
          />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-6">
          <Link href="/" className="hover:text-gray-400">Home</Link>
          <Link href="/shop" className="hover:text-gray-400">Shop</Link>
          <Link href="/about" className="hover:text-gray-400">About</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
          <Link href="/cartsummary" className="hover:text-gray-400">
            <div className="relative">
              <FaShoppingCart size={24} />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                  {totalCartCount}
                </span>
              )}
            </div>
          </Link>
        </nav>

        {/* Mobile/Medium Screen - Cart and Menu */}
        <div className="flex items-center space-x-4 lg:hidden">
          <Link href="/cartsummary" className="hover:text-gray-400">
            <div className="relative">
              <FaShoppingCart size={24} />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                  {totalCartCount}
                </span>
              )}
            </div>
          </Link>
          <button onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-black text-white transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-gray-400">Home</Link>
          <Link href="/shop" onClick={() => setIsOpen(false)} className="hover:text-gray-400">Shop</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-gray-400">About</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-gray-400">Contact</Link>
        </nav>
      </div>
    </>
  );
}