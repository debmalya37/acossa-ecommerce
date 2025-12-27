/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import { PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import Image from "next/image";
import BrandPromises from "@/components/Home/BrandPromises";
import banner5 from "../../../public/assets/images/hero/5.png";
import banner1 from "../../../public/assets/images/hero/1.png";
import { Playfair_Display, Inter } from 'next/font/google';

// ✅ Optimize Fonts using Next/Font (Faster than @import)
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

/* ---------------------------
   Types
   --------------------------- */
type RealProduct = {
  _id: string;
  name: string;
  slug: string;
  sellingPrice: number;
  mrp: number;
  discountPercentage: number;
  media: { secure_url: string }[];
  sizes?: string[];
};

interface PageClientProps {
  initialLatest: RealProduct[];
  initialPremium: RealProduct[];
  initialCategories: any[];
  initialBlogs: any[];
}

const OrnateDivider: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center justify-center my-6 ${className || ""}`}>
    <svg width="160" height="24" viewBox="0 0 160 24" fill="none" className="opacity-90">
      <path d="M10 12C22 2 40 2 52 12C64 22 82 22 94 12C106 2 124 2 136 12" stroke="#7a1b12" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(72 0)">
        <circle cx="8" cy="8" r="6" fill="#7a1b12" opacity="0.95" />
      </g>
    </svg>
  </div>
);

// ... (Keep staticCategories and heroSlides arrays as they were) ...
const staticCategories = [
  { id: 1, label: "SUIT SETS", image: "https://womenplusindia.com/cdn/shop/files/3861_III.jpg?v=1683112670&width=850", link: "/shop?category=suit-sets" },
  { id: 2, label: "SAREES", image: "https://medias.utsavfashion.com/media/catalog/product/cache/1/image/500x/040ec09b1e35df139433887a97daa66f/e/m/embroidered-border-art-silk-t-saree-in-light-beige-v1-ssha1563.jpg", link: "/shop" },
  { id: 3, label: "KURTAS", image: "https://cdn.shopify.com/s/files/1/0572/5555/9212/files/BHKS709_5_e0daa2dc-abd0-458a-85f5-55013ada2546.jpg?v=1753699167", link: "/shop" },
  { id: 4, label: "LEHENGAS", image: "https://www.mymoledro.com/cdn/shop/files/4-_2_800x.jpg?v=1751284778", link: "/shop" },
  { id: 5, label: "GOWNS", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop", link: "/shop" },
  { id: 6, label: "CO-ORDS", image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1934&auto=format&fit=crop", link: "/shop" },
];

const heroSlides = [
  { title: "Bridal Elegance", subtitle: "Timeless · Handcrafted · Heirloom", description: "Curated bridal sarees and lehengas with exquisite zardozi.", image: "/assets/images/hero/1.png", mobileImage: "/assets/images/hero/hero-mobile-1.png", cta: "Explore Bridal" },
  { title: "Festive Lehengas", subtitle: "Festive · Statement · Luxe", description: "Statement lehengas for your grand celebrations.", image: "/assets/images/hero/2.png", mobileImage: "/assets/images/hero/hero-mobile-2.png", cta: "Shop Lehengas" },
  { title: "Designer Sarees", subtitle: "Modern Drapes, Heritage Weaves", description: "Contemporary silhouettes with rich handwork.", image: "/assets/images/hero/3.png", mobileImage: "/assets/images/hero/hero-mobile-3.png", cta: "Discover Sarees" },
];

const PremiumHome: React.FC<PageClientProps> = ({ 
  initialLatest, 
  initialPremium, 
  initialCategories, 
  initialBlogs 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // ✅ Hero Auto-slide
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`min-h-screen bg-rose-50 text-gray-800 ${playfair.variable} ${inter.variable} font-sans`}>
      <style>{`
        :root{ --rose:#7a1b12; --gold:#b8864b; --ivory:#fff8f6; }
        .premium-serif{ font-family: var(--font-serif), serif; }
        .ui-sans{ font-family: var(--font-sans), sans-serif; }
      `}</style>

      {/* Top tiny notice */}
      <div className="bg-black text-white text-xs py-1 text-center">Free Shipping on Orders Above ₹2,999 — Handcrafted in India</div>

      {/* HERO SECTION */}
      <section className="relative h-[55vh] lg:h-[72vh] overflow-hidden">
        {heroSlides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          // ✅ LCP Optimization: Load first image immediately
          const isLCP = idx === 0; 

          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}`}
              aria-hidden={!isActive}
            >
              {/* MOBILE IMAGE */}
              <div className="lg:hidden absolute inset-0">
                <Image
                  src={slide.mobileImage}
                  alt={slide.title}
                  fill
                  priority={isLCP}
                  sizes="100vw"
                  className="object-contain bg-black"
                  placeholder="blur"
                  blurDataURL="/assets/images/hero/blur-placeholder.png"
                />
              </div>

              {/* DESKTOP IMAGE */}
              <div className="hidden lg:block absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={isLCP}
                  sizes="100vw"
                  className="object-cover brightness-90"
                  placeholder="blur"
                  blurDataURL="/assets/images/hero/blur-placeholder.png"
                />
              </div>

              {/* TEXT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/15" />
              <div className="absolute inset-0 flex items-center z-20 pointer-events-none">
                <div className="max-w-6xl mx-auto px-6 lg:px-12 text-white w-full">
                  <div className="max-w-xl pointer-events-auto">
                    <OrnateDivider />
                    <Link href="/shop" className="inline-block mt-4 px-6 py-3 border border-white/30 text-white rounded-md backdrop-blur-sm hover:bg-white/10 transition">
                      Explore More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Nav Buttons */}
        <button onClick={() => setCurrentSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full z-20 hover:bg-white/30"><ChevronLeft /></button>
        <button onClick={() => setCurrentSlide((s) => (s + 1) % heroSlides.length)} className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full z-20 hover:bg-white/30"><ChevronRight /></button>
      </section>

      {/* PROMO BANNER */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-10">
          <div className="relative w-full h-[260px] md:h-[360px] lg:h-[420px] overflow-hidden rounded-xl group">
            <Image src={banner5} alt="Party Edit" fill sizes="(max-width: 768px) 100vw, 100vw" className="object-cover group-hover:scale-105 transition-all duration-700" />
          </div>
          <div className="relative w-full h-[260px] md:h-[360px] lg:h-[420px] overflow-hidden rounded-xl group">
            <Image src={banner1} alt="Sangeet Edit" fill sizes="(max-width: 768px) 100vw, 100vw" className="object-cover group-hover:scale-105 transition-all duration-700" />
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY (Static) */}
      <section className="py-10 bg-rose-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="premium-serif text-3xl lg:text-4xl text-gray-900">Shop By Category</h2>
            <OrnateDivider />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticCategories.map((cat) => (
              <Link href={cat.link} key={cat.id} className="block">
                <div className="relative group rounded-xl overflow-hidden aspect-[3/4] cursor-pointer shadow-md">
                  <img src={cat.image} alt={cat.label} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-black/85 backdrop-blur-sm text-white px-6 py-3 rounded text-xs font-bold tracking-[0.2em] uppercase shadow-lg group-hover:bg-black transition-colors">
                      {cat.label}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL BANNER SECTION */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {/* Banner 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-lg overflow-hidden h-[400px]">
              <img src="/assets/images/solid.png" alt="Simply Solids" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center px-4 md:px-8">
              <h2 className="premium-serif text-4xl md:text-5xl font-semibold text-emerald-900">Shop Glam Look</h2>
              <div className="relative my-4"><div className="w-full h-[1.5px] bg-emerald-700/40"></div></div>
              <p className="text-gray-700 mb-6">Experience elegance in every piece, created to flatter and shine.</p>
              <Link href="/shop" className="inline-block text-center bg-emerald-800 text-white px-6 py-3 rounded-md text-sm font-semibold tracking-wide hover:bg-emerald-900 transition">EXPLORE NOW</Link>
            </div>
          </div>
           {/* Banner 2 */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-lg overflow-hidden h-[400px]">
              <img src="/assets/images/ink.png" alt="Gypsy Ink" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center px-4 md:px-8">
              <h2 className="premium-serif text-4xl md:text-5xl font-semibold text-rose-900">Simply Royal</h2>
              <div className="relative my-4"><div className="w-full h-[1.5px] bg-rose-800/40"></div></div>
              <p className="text-gray-700 mb-6">Step into a world of quiet royalty with designs that feel timeless and fresh.</p>
              <Link href="/shop" className="inline-block bg-rose-800 text-center text-white px-6 py-3 rounded-md text-sm font-semibold tracking-wide hover:bg-rose-900 transition">EXPLORE NOW</Link>
            </div>
          </div>
        </div>
      </section>

      <BrandPromises />

      {/* NEW CATALOGUE SECTION (Premium Products Slider) */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            <div className="col-span-1 flex flex-col items-start md:pr-10">
              <h2 className="premium-serif text-3xl md:text-5xl font-semibold leading-tight text-gray-900">
                Shop show-stopping<br />pieces from the<br />new catalogue.
              </h2>
              <button className="mt-8 bg-rose-300 text-white px-8 py-3 rounded-md font-semibold tracking-wide shadow hover:bg-rose-400 transition">
                <Link href="/shop">SHOP THE CATALOGUE</Link>
              </button>
            </div>
            
            {/* Horizontal Slider */}
            <div className="col-span-2 overflow-x-auto scrollbar-hide pb-4">
              <div className="flex gap-6 w-max">
                {initialPremium.map((p) => (
                  <Link href={PRODUCT_DETAILS(p.slug)} key={p._id} className="min-w-[240px] max-w-[260px] bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border block">
                    <div className="relative aspect-[3/4]">
                      <img src={p.media?.[0]?.secure_url} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                      <span className="absolute bottom-3 left-3 bg-black text-white text-[10px] px-2 py-[2px] rounded">NEW SEASON</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm leading-tight line-clamp-2">{p.name}</h3>
                      <p className="mt-2 text-gray-900 font-semibold">
                        {p.sellingPrice.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="premium-serif text-3xl text-rose-900">Featured Collection</h2>
          <OrnateDivider />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {initialPremium.slice(0, 4).map((p) => (
              <article key={p._id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 transition">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Link href={PRODUCT_DETAILS(p.slug)}>
                    <img src={p.media?.[0]?.secure_url} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    {p.discountPercentage > 0 && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-amber-300 text-black">{p.discountPercentage}% OFF</span>
                    )}
                  </Link>
                </div>
                <div className="p-4" onMouseEnter={() => setHoveredProduct(p._id)} onMouseLeave={() => setHoveredProduct(null)}>
                  <h3 className="font-medium text-sm line-clamp-2">{p.name}</h3>
                  <div className="flex gap-3 mt-2 items-baseline">
                    <div className="text-lg font-bold text-rose-900">₹{p.sellingPrice}</div>
                    <div className="text-sm text-gray-400 line-through">₹{p.mrp}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

       {/* Banner Blocks – Gilded / Prisme / Rang-e-Bagh style */}
      {/* <InstagramFeed /> */}

      {/* Testimonials */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="premium-serif text-3xl text-rose-900">WEDDING VIBES</h2>
          <OrnateDivider />
          <p className="text-gray-600 mb-8">Stories from brides who loved our craftsmanship</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-rose-50 rounded-xl p-6">
              <div className="text-rose-900 font-medium mb-3">“Absolutely stunning craftsmanship — my bridal saree felt like art.”</div>
              <div className="text-sm text-gray-600">— Shruti, Mumbai</div>
            </div>
            <div className="bg-rose-50 rounded-xl p-6">
              <div className="text-rose-900 font-medium mb-3">“Perfect fit and extraordinary detailing. Highly recommended.”</div>
              <div className="text-sm text-gray-600">— Ananya, Delhi</div>
            </div>
            <div className="bg-rose-50 rounded-xl p-6">
              <div className="text-rose-900 font-medium mb-3">“Quality and service were impeccable. Loved it!”</div>
              <div className="text-sm text-gray-600">— Ritu, Bangalore</div>
            </div>
          </div>
        </div>
      </section>
      {/* Blog / Editorial */}
      {initialBlogs.length > 0 && (
       <section className="py-14 bg-rose-50">
    <div className="max-w-7xl mx-auto px-6">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl md:text-4xl text-rose-900 tracking-wide">
          Latest Editorials
        </h2>
        <OrnateDivider />
        <p className="text-gray-600 text-sm md:text-base">
          Stories · Style guides · Behind the craft
        </p>
      </div>

      {/* BLOG CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {initialBlogs.map((blog) => (
          <article
            key={blog._id}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <Link href={`/blog/${blog.slug}`}>

              <div className="bg-rose-100 flex items-center justify-center h-48">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="max-h-full object-contain"
                />
              </div>

              <div className="p-6">
                {blog.categories?.length > 0 && (
                  <p className="text-xs uppercase tracking-wide text-rose-500 mb-2">
                    {blog.categories[0]}
                  </p>
                )}

                <h3 className="font-serif font-semibold text-lg mb-2 line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {blog.excerpt}
                </p>

                <p className="mt-4 text-xs text-gray-500">
                  {new Date(blog.createdAt).toDateString()}
                </p>
              </div>

            </Link>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="inline-block text-sm font-medium text-rose-700 border-b border-rose-300 hover:border-rose-600 transition"
        >
          View All Editorials →
        </Link>
      </div>
    </div>
  </section>
      )}
    </div>
  );
};

export default PremiumHome;