import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  User,
  MessageSquare,
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  service: string;
}

interface Errors {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  service: string;
}

interface VisibilityState {
  [key: string]: boolean;
}

const BlacksfitContact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: '',
  });

  const [errors, setErrors] = useState<Errors>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: '',
  });

  const [isVisible, setIsVisible] = useState<VisibilityState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (submitStatus === 'success') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: Errors = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      service: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      valid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      valid = false;
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message should be at least 20 characters';
      valid = false;
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission - replace with actual endpoint
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success most of the time
          if (Math.random() > 0.2) {
            resolve('success');
          } else {
            reject(new Error('Submission failed'));
          }
        }, 2000);
      });

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        service: '',
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Call Us',
      details: ['+234 (0) 703 283 5482', '+234 (0) 901 000 000'],
      description: 'Available 24/7 for emergencies',
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      details: ['info@blacksfit.ng', 'support@blacksfit.ng'],
      description: 'We respond within 2 hours',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Visit Us',
      details: ['Lagos: Victoria Island'],
      description: 'Multiple locations across Nigeria',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Operating Hours',
      details: ['Mon - Fri: 5:00 AM - 11:00 PM', 'Sat - Sun: 6:00 AM - 10:00 PM'],
      
    },
  ];

  const services = [
    'Personal Training',
    'Group Fitness Classes',
    'Nutrition Consultation',
    'Corporate Wellness',
    'Online Coaching',
    'Recovery & Therapy',
    'Youth Programs',
    'General Inquiry',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-white rounded-full opacity-5 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gray-300 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '1000ms' }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
          <div
            id="hero"
            data-animate
            className={`transform transition-all duration-1000 ${
              isVisible['hero'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <div className="w-24 h-1 bg-white mx-auto mb-8" />
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
              Ready to transform your fitness journey? Let's connect and build something amazing together.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div
            id="contact-title"
            data-animate
            className={`text-center mb-16 transform transition-all duration-1000 ${
              isVisible['contact-title'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">Connect With BLACKSFIT</h2>
            <div className="w-24 h-1 bg-black mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                id={`contact-${index}`}
                data-animate
                className={`transform transition-all duration-1000 ${
                  isVisible[`contact-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100">
                  <div className="text-black mb-4 group-hover:scale-110 transition-transform duration-300">{info.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-black">{info.title}</h3>
                  <div className="space-y-2 mb-4">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700 font-medium">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm">{info.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto">
          <div
            id="form-title"
            data-animate
            className={`text-center mb-16 transform transition-all duration-1000 ${
              isVisible['form-title'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Send Us A Message</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8" />
            <p className="text-xl text-gray-300">Let's discuss how we can help you achieve your fitness goals</p>
          </div>

          <div
            id="contact-form"
            data-animate
            className={`transform transition-all duration-1000 ${
              isVisible['contact-form'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <div className={`relative ${focusedField === 'name' ? 'ring-2 ring-white rounded-md' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={handleBlur}
                      className={`bg-gray-900 border ${errors.name ? 'border-red-500' : 'border-gray-700'} text-white text-sm rounded-lg focus:ring-white focus:border-white block w-full pl-10 p-2.5`}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <div className={`relative ${focusedField === 'email' ? 'ring-2 ring-white rounded-md' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      className={`bg-gray-900 border ${errors.email ? 'border-red-500' : 'border-gray-700'} text-white text-sm rounded-lg focus:ring-white focus:border-white block w-full pl-10 p-2.5`}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <div className={`relative ${focusedField === 'phone' ? 'ring-2 ring-white rounded-md' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('phone')}
                      onBlur={handleBlur}
                      className={`bg-gray-900 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} text-white text-sm rounded-lg focus:ring-white focus:border-white block w-full pl-10 p-2.5`}
                      placeholder="+234 123 456 7890"
                      required
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('subject')}
                    onBlur={handleBlur}
                    className={`bg-gray-900 border ${errors.subject ? 'border-red-500' : 'border-gray-700'} text-white text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5`}
                    placeholder="What's this about?"
                    required
                  />
                  {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="service" className="block text-sm font-medium mb-2">
                    Service Interested In *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('service')}
                    onBlur={handleBlur}
                    className={`bg-gray-900 border ${errors.service ? 'border-red-500' : 'border-gray-700'} text-white text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5`}
                    required
                  >
                    <option value="">Select a service</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  {errors.service && <p className="mt-1 text-sm text-red-500">{errors.service}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Your Message *
                  </label>
                  <div className={`relative ${focusedField === 'message' ? 'ring-2 ring-white rounded-md' : ''}`}>
                    <div className="absolute top-3 left-3">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('message')}
                      onBlur={handleBlur}
                      rows={5}
                      className={`bg-gray-900 border ${errors.message ? 'border-red-500' : 'border-gray-700'} text-white text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5 pl-10`}
                      placeholder="Tell us about your fitness goals..."
                      required
                    />
                  </div>
                  {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-white to-gray-300 text-black hover:shadow-2xl transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-3" />
                      Send Message
                    </>
                  )}
                </button>
              </div>

              {/* Submission Status */}
              {submitStatus === 'success' && (
                <div className="mt-6 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 text-green-400 bg-green-400 bg-opacity-10 p-6 rounded-lg border border-green-400 border-opacity-30">
                    <CheckCircle className="w-12 h-12 animate-bounce" />
                    <span className="text-2xl font-bold">Thank You!</span>
                    <p className="text-lg">Your message has been sent successfully.</p>
                    <p className="text-sm text-green-300">We'll get back to you within 24 hours.</p>
                    {showConfetti && (
                      <div className="relative w-full h-24 overflow-hidden mt-5">
                        {[...Array(50)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-2 h-2 animate-bounce"
                            style={{
                              left: `${Math.random() * 100}%`,
                              animationDelay: `${Math.random() * 2}s`,
                              backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                              animationDuration: '3s',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center justify-center space-x-2 text-red-400 bg-red-400 bg-opacity-10 p-4 rounded-lg border border-red-400 border-opacity-30">
                  <AlertCircle className="w-5 h-5" />
                  <span>Something went wrong. Please try again.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div
            id="location-title"
            data-animate
            className={`text-center mb-16 transform transition-all duration-1000 ${
              isVisible['location-title'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">Find Us</h2>
            <div className="w-24 h-1 bg-black mx-auto" />
          </div>

          <div
            id="map-section"
            data-animate
            className={`transform transition-all duration-1000 ${
              isVisible['map-section'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-black to-gray-800 text-white p-8">
                <div className="grid md:grid justify-center gap-8">
                  <div style={{}}>
                    <h3 className="text-2xl font-bold mb-4">Lagos Location</h3>
                    <p className="text-gray-300 mb-2">123 Fitness Avenue</p>
                    <p className="text-gray-300 mb-2">Victoria Island, Lagos</p>
                    <p className="text-gray-300">Nigeria</p>
                  </div>
                 
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlacksfitContact;