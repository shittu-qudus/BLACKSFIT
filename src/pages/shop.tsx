'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Shop() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg"
      >
        <Image
          src="/images/empty-shop.svg" // 👈 Replace with your own illustration or icon
          alt="No Products"
          width={300}
          height={300}
          className="mx-auto mb-6"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Oops! No New Products
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Sorry, there are no new items in stock right now. Please check back later or follow us for updates!
        </p>

        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 text-white bg-black hover:bg-gray-900 rounded-xl transition-all duration-300"
        >
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
