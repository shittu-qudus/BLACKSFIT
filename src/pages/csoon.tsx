import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const ComingSoon = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after 3 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>Coming Soon - Blacksfit</title>
        <meta name="description" content="This page is coming soon. Please check back later." />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              BLACKSFIT
            </h1>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-light">
              Sorry, this page is coming soon
            </h2>
            <p className="text-lg text-gray-300">
              Come back later
            </p>
            
            <div className="mt-8">
              <div className="inline-block">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Redirecting in 3 seconds...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComingSoon;