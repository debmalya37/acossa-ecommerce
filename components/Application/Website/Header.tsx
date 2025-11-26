/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import CartPage from "@/components/Application/Website/Cart";
import axios from "axios";
import Link from 'next/link';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // ============================
  // REAL CATEGORY STATE
  // ============================
  const [sareeCategories, setSareeCategories] = useState<
    { _id: string; name: string; slug: string }[]
  >([]);

  // ============================
  // FETCH REAL CATEGORIES (ONLY SAREES)
  // ============================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_URL;

        const { data } = await axios.get(`${base}/api/category?size=50`);

        if (data.success) {
          // Example logic:
          // You have categories like "Soft-Silk-saree", "georgette-ready-to-wear-saree", etc.
          // Filter ONLY categories belonging to SAREES
          const sareeCats = data.data.filter((cat: any) =>
            cat.slug?.toLowerCase().includes("saree")
          );

          setSareeCategories(sareeCats);
        }
      } catch (error) {
        console.log("Category fetch error:", error);
      }
    };

    fetchCategories();
  }, []);

  // ============================
  // STATIC CATEGORY MENU
  // (Only Sarees replaced by real data)
  // ============================

  const categories = {
    'Sarees': sareeCategories,                   // Now dynamic
    'Lehengas': ['Bridal Lehengas', 'Designer Lehengas', 'Wedding Lehengas'],
    'Suits & Sets': ['Anarkali Sets', 'Sharara Sets', 'Palazzo Sets'],
    'Occasion': ['Wedding', 'Festive', 'Party Wear'],
    'New Arrivals': []
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-black text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="hidden md:block">Free Shipping on Orders Above ₹2,999 | Handcrafted in India</p>
          <p className="md:hidden">Free Shipping Above ₹2,999</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">Track Order</a>
            <span>|</span>
            <a href="#" className="hover:text-gray-300">Store Locator</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/">
              {/* Using the path you specified. In a real app, ensure this file exists in public/assets/image/logo/ */}
              <img 
                src="/assets/images/logo/acossa.jpg" 
                alt="ACOSSA ENTERPRISE" 
                className="h-20 md:h-28 w-auto object-contain"
                onError={(e: any) => {
                   // Fallback if image is missing during preview
                   e.target.style.display = 'none';
                   e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden text-2xl font-serif font-bold tracking-wider">ACOSSA</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
  href="/shop"
  className="text-base font-medium tracking-wide hover:text-rose-600 transition-colors"
>
  Shop
</Link>

            {Object.keys(categories).map((category) => (
              <div 
                key={category}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(category)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-base font-medium tracking-wide hover:text-rose-600 transition-colors flex items-center gap-1">
                  {category}
                  {categories[category as keyof typeof categories].length > 0 && (
                    <ChevronDown size={14} />
                  )}
                </button>
                
                {/* Dropdown */}
                {categories[category as keyof typeof categories].length > 0 && (
                  <div className={`absolute top-full left-0 mt-2 w-56 bg-white shadow-xl border border-gray-100 rounded-sm transition-all duration-200 ${
                    activeDropdown === category ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}>
                    <div className="py-2">
                      {category === "Sarees"
                        ? sareeCategories.map((cat) => (
                            <a
                              key={cat._id}
                              href={`/shop?category=${cat._id}`}
                              className="block px-4 py-2 text-base hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              {cat.name}
                            </a>
                          ))
                        : categories[category as keyof typeof categories].map((item:any) => (
                            <a 
                              key={item}
                              href="/shop" 
                              className="block px-4 py-2 text-base hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              {item}
                            </a>
                          ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link
  href="/wholesaler"
  className="text-base font-medium tracking-wide hover:text-rose-600 transition-colors"
>
  Wholesale
</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="hover:text-rose-600 transition-colors hidden md:block">
              <Search size={20} />
            </button>
            <button className="hover:text-rose-600 transition-colors">
              <User size={20} />
            </button>
            <button className="hover:text-rose-600 transition-colors">
              <Heart size={20} />
            </button>
            <CartPage />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search for sarees, lehengas..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-rose-600"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 absolute top-full left-0 right-0 shadow-lg max-h-[calc(100vh-180px)] overflow-y-auto">
          <nav className="py-4">
            <Link
  href="/shop"
  className="text-sm font-medium tracking-wide hover:text-rose-600 transition-colors"
>
  Shop
</Link>

            {Object.entries(categories).map(([category, items]) => (
              <div key={category} className="border-b border-gray-100">
                <button 
                  className="w-full px-4 py-3 text-left font-medium flex items-center justify-between"
                  onClick={() => setActiveDropdown(activeDropdown === category ? null : category)}
                >
                  {category}
                  {items.length > 0 && (
                    <ChevronDown 
                      className={`transition-transform ${activeDropdown === category ? 'rotate-180' : ''}`}
                      size={18} 
                    />
                  )}
                </button>

                {/* MOBILE DROPDOWN */}
                {items.length > 0 && activeDropdown === category && (
                  <div className="bg-gray-50 px-4 py-2">
                    {category === "Sarees"
                      ? sareeCategories.map((cat) => (
                          <a
                            key={cat._id}
                            href={`/shop?category=${cat._id}`}
                            className="block py-2 text-sm text-gray-700 hover:text-rose-600"
                          >
                            {cat.name}
                          </a>
                        ))
                      : items.map((item:any) => (
                          <a 
                            key={item}
                            href="#" 
                            className="block py-2 text-sm text-gray-700 hover:text-rose-600"
                          >
                            {item}
                          </a>
                        ))}
                  </div>
                )}
              </div>
            ))}
            <Link
  href="/wholesaler"
  className="text-base font-medium tracking-wide hover:text-rose-600 transition-colors"
>
  Wholesale
</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
