'use client';

import React, { useState } from 'react';
import { ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
    companyName: '',
    website: '',
    gstNumber: '',
    address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form or redirect logic here
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[60vh] min-h-[400px] w-full bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1610189012906-47029676afba?q=80&w=2070&auto=format&fit=crop" 
            alt="Saree Wholesale Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay */}
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 text-white">
          <span className="uppercase tracking-[0.2em] text-xs md:text-sm font-medium mb-4">
            Become a Partner
          </span>
          <h1 className="text-4xl md:text-6xl font-serif mb-4">
            Signup for Wholesale
          </h1>
          <p className="text-sm md:text-lg font-light max-w-lg opacity-90">
            Fill the form below to access wholesale prices
          </p>
        </div>
      </div>

      {/* --- INTRO TEXT --- */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          Sign up as a wholesale customer to access bulk quantity, a tailored wholesale shopping experience, and additional benefits. Complete the form below to proceed.
        </p>
      </div>

      {/* --- FORM SECTION --- */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-serif text-amber-700 mb-2">
            Wholesale Signup
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            Fill in the details and we&apos;ll get back to you within 48 to 72 hours
          </p>
        </div>

        {submitStatus === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-green-800 mb-2">Request Received!</h3>
            <p className="text-green-700">
              Thank you for your interest. Our team will review your application and contact you shortly.
            </p>
            <button 
              onClick={() => setSubmitStatus('idle')}
              className="mt-6 text-sm font-medium text-green-800 underline hover:text-green-900"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                required
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 placeholder-gray-400 text-sm transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 placeholder-gray-400 text-sm transition-colors"
              />
            </div>

            {/* Phone Number with Country Code */}
            <div className="flex">
              <div className="relative">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="appearance-none w-[80px] px-3 py-3 rounded-l border border-r-0 border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 text-sm cursor-pointer"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
              </div>
              <input
                type="tel"
                name="phone"
                required
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 px-4 py-3 rounded-r border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 placeholder-gray-400 text-sm transition-colors"
              />
            </div>

            {/* Company Name */}
            <div>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 placeholder-gray-400 text-sm transition-colors"
              />
            </div>

            {/* Website */}
            <div>
              <input
                type="url"
                name="website"
                placeholder="Website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 placeholder-gray-400 text-sm transition-colors"
              />
            </div>

            {/* GST Number */}
            <div>
              <input
                type="text"
                name="gstNumber"
                placeholder="GST Number"
                value={formData.gstNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 placeholder-gray-400 text-sm transition-colors"
              />
            </div>

            {/* Address */}
            <div>
              <textarea
                name="address"
                rows={4}
                required
                placeholder="Full Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 placeholder-gray-400 text-sm transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white font-medium py-3.5 px-4 rounded hover:bg-black transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Request Wholesale Signup'
              )}
            </button>

            {/* Footer Note */}
            <p className="text-[10px] text-center text-gray-400 mt-4">
              Fill in the details and we&apos;ll get back to you within 48 to 72 hours.
            </p>

          </form>
        )}
      </div>
    </div>
  );
}