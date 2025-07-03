 'use client';
import { motion } from 'framer-motion';
import { useState} from 'react';
import Link from 'next/link'
import Image from 'next/image';
const BlacksfitBanner = () => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fallback gradient background
  const fallbackBackground = "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #0f0f0f 100%)";

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Background Image with Error Handling */}
      {!imageError && (
        <Image
          src="/image/newbg.png"
          alt="Blacksfit banner"
          height={100}
          width={100}

          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            console.log('Image failed to load: /image/newbg.png');
          }}
        />
      )}
      
      {/* Fallback Background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: imageError || !imageLoaded ? fallbackBackground : 'transparent',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
<div 
  className="absolute inset-0 w-full h-full bg-cover bg-center"
  style={{ backgroundImage: 'url(/image/newbg.png)' }}
/>
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-20 z-10 text-left">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold mb-6"
        >
          Blacksfit
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="max-w-xl text-lg md:text-xl leading-relaxed"
        >
          Time waits for no one, Opportunities belong to those who chase them. 
          Whether in traffic or the marketplace, the hustle never stops. 
          Work hard. Stay sharp. Keep moving.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-10 space-y-2 text-sm md:text-base"
        >
          <p>Proud to be <strong>BLACK</strong></p>
          <p>Proud to be <strong>AFRICAN</strong></p>
          <p>Proud to be <strong>NIGERIAN</strong></p>
        </motion.div>

        {/* Shop Now Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-8"
        >
          <button className="inline-block px-6 py-3 bg-white text-black font-semibold text-sm md:text-base rounded-full shadow-md hover:bg-gray-200 transition cursor-pointer">
            <Link href="/shop">shop now</Link>
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 right-6 text-xs md:text-sm italic"
        >
          #No sleep, just grind.
        </motion.p>
      </div>

      {/* Debug Info - Remove in production */}
      {imageError && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-xs z-20">
          Image not found: /image/newbg.png
        </div>
      )}
    </div>
  );
};

export default BlacksfitBanner;