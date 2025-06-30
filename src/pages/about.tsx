import React, { useState, useEffect } from 'react';
import { ChevronDown, Users, Heart, Target, Globe } from 'lucide-react';

const BlacksfitAbout = () => {
    const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Unity",
      desc: "Built on Ubuntu philosophy - 'I am because we are'"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Cultural Heritage",
      desc: "Celebrating 250+ Nigerian ethnic groups and traditions"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Holistic Wellness",
      desc: "Mind, body, and spirit aligned with African wisdom"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "African Excellence",
      desc: "Redefining fitness culture across the continent"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full opacity-5 animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div 
            className="absolute top-3/4 right-1/4 w-48 h-48 bg-gray-300 rounded-full opacity-5 animate-pulse delay-1000"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          />
          <div 
            className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-gray-400 rounded-full opacity-5 animate-pulse delay-2000"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          />
        </div>

        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="tribal" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <polygon points="10,2 14,8 10,14 6,8" fill="currentColor" className="animate-pulse"/>
                <circle cx="10" cy="10" r="1" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tribal)"/>
          </svg>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center text-white max-w-4xl">
            <div className="mb-8 transform transition-all duration-1000 animate-fadeInUp">
              <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent animate-pulse">
                BLACKSFIT
              </h1>
              <div className="w-32 h-1 bg-white mx-auto mb-6 animate-expandWidth"/>
            </div>
            
            <div className="transform transition-all duration-1000 delay-300 animate-fadeInUp">
              <h2 className="text-2xl md:text-4xl font-light mb-6 animate-slideInFromLeft">
                Rooted in Heritage, Designed for Excellence
              </h2>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto animate-slideInFromRight">
                Celebrating African strength, Nigerian pride, and the unbreakable spirit that defines us
              </p>
            </div>

            <div className="mt-12 animate-bounce">
              <ChevronDown className="w-8 h-8 mx-auto text-gray-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Foundation */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div 
            id="culture"
            data-animate
            className={`text-center mb-16 transform transition-all duration-1000 ${
              isVisible.culture ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Our Cultural Foundation
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-8"/>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div 
              id="culture-text"
              data-animate
              className={`transform transition-all duration-1000 delay-200 ${
                isVisible['culture-text'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
            >
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Nigeria, the giant of Africa, is home to over 250 ethnic groups, each contributing unique 
                traditions, values, and perspectives to our national identity. From the disciplined warrior 
                traditions of the Hausa-Fulani in the North, to the entrepreneurial spirit of the Igbo in 
                the East, and the artistic excellence of the Yoruba in the West.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our brand embodies the <span className="font-semibold text-black">Ubuntu</span> philosophy that resonates across Africa: <em>&quot;I am because we are.&quot;</em>

              </p>
            </div>

            <div 
              id="culture-visual"
              data-animate
              className={`transform transition-all duration-1000 delay-400 ${
                isVisible['culture-visual'] ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-black to-gray-800 p-8 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white p-6 rounded-xl">
                    <div className="flex justify-center space-x-2 mb-4">
                      <div className="w-4 h-4 bg-black rounded-full animate-pulse"/>
                      <div className="w-4 h-4 bg-white border-2 border-black rounded-full animate-pulse delay-300"/>
                      <div className="w-4 h-4 bg-black rounded-full animate-pulse delay-600"/>
                    </div>
                    <h3 className="text-2xl font-bold text-center text-black">250+</h3>
                    <p className="text-center text-gray-600">Ethnic Groups United</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div 
            id="features-title"
            data-animate
            className={`text-center mb-16 transform transition-all duration-1000 ${
              isVisible['features-title'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The BLACKSFIT Philosophy</h2>
            <div className="w-24 h-1 bg-white mx-auto"/>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                id={`feature-${index}`}
                data-animate
                className={`text-center transform transition-all duration-1000 ${
                  isVisible[`feature-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-white bg-opacity-10 p-8 rounded-2xl backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 group">
                  <div className="text-white mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl text-black font-bold mb-3">{feature.title}</h3>
                  <p className="text-black leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-6xl mx-auto text-white">
          <div 
            id="mission"
            data-animate
            className={`transform transition-all duration-1000 ${
              isVisible.mission ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Mission</h2>
              <div className="w-24 h-1 bg-white mx-auto mb-8"/>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-white bg-opacity-5 p-8 rounded-3xl backdrop-blur-sm border border-white border-opacity-10">
                <h3 className="text-2xl text-black font-bold mb-6 text-center">Redefining African Fitness</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"/>
                 <p className="text-black">Celebrate and amplify Africa&apos;s natural athletic heritage and strength traditions</p>

                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"/>
                    <p className="text-black">Make holistic wellness accessible across all socioeconomic backgrounds</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"/>
                    <p className="text-black">Build supportive communities that prioritize collective growth over individual competition</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-5 p-8 rounded-3xl backdrop-blur-sm border border-white border-opacity-10">
                <h3 className="text-2xl text-black font-bold mb-6 text-center">Preserving Our Legacy</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"/>
                    <p className="text-black">Modernize traditional movement practices while honoring their cultural significance</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"/>
                    <p className="text-black">Inspire the next generation of healthy, confident Africans proud of their heritage</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"/>
                    <p className="text-black">Champion culturally-authentic approaches to wellness that respect local customs and climate</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <div className="bg-white bg-opacity-10 p-6 rounded-2xl backdrop-blur-sm border border-white border-opacity-20 max-w-4xl mx-auto">
               <p className="text-xl  text-black font-light italic">
  &quot;We believe fitness in Lagos should honor Nigerian values, wellness in Abuja should reflect our climate, 
  and strength training across Africa should celebrate the power that runs through our ancestral lines.&quot;
</p>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            id="cta"
            data-animate
            className={`transform transition-all duration-1000 ${
              isVisible.cta ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the BLACKSFIT Family
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Discover your strength. Celebrate your heritage. Transform your life.
            </p>
            <button className="bg-gradient-to-r from-white to-gray-300 text-black px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              Start Your Journey
            </button>
            <div className="mt-8 text-sm text-gray-400">
              <em>Where African Excellence Meets Modern Fitness</em>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 8rem;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }

        .animate-slideInFromLeft {
          animation: slideInFromLeft 1s ease-out 0.3s both;
        }

        .animate-slideInFromRight {
          animation: slideInFromRight 1s ease-out 0.5s both;
        }

        .animate-expandWidth {
          animation: expandWidth 1s ease-out 0.8s both;
        }
      `}</style>
    </div>
  );
};

export default BlacksfitAbout;