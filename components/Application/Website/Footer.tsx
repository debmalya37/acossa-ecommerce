"use client";

import React from "react";
// import Link from "next/link"; // Commented out for preview environment
import { Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react";

// Mock Link component for preview environment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Link = ({ href, children, className, ...props }: any) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer className="relative bg-rose-900 text-white pt-12 pb-6 overflow-hidden">
      
      {/* --- BACKGROUND IMAGE --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/images/footer-bg-2.png" 
          alt="Footer Pattern" 
          className="w-full h-full object-cover object-bottom opacity-100"
          onError={(e: any) => e.target.style.display = 'none'} 
        />
        {/* Optional overlay to ensure text readability if the image is too bright */}
        <div className="absolute inset-0 bg-rose-900/10" /> 
      </div>

      {/* --- CONTENT (Relative z-10 to sit on top of image) --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-3xl font-bold tracking-wide">ACOSAA</h2>
          <p className="mt-3 text-sm text-rose-100 leading-relaxed max-w-xs">
            Handcrafted designer sarees & bridal couture — curated with elegance 
            and rooted in India’s textile heritage.
          </p>

          {/* Social */}
          <div className="flex gap-4 mt-5">
            <Link href="#" className="hover:text-rose-200 hover:scale-110 transition-transform">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="hover:text-rose-200 hover:scale-110 transition-transform">
              <Facebook size={20} />
            </Link>
            <Link href="#" className="hover:text-rose-200 hover:scale-110 transition-transform">
              <Youtube size={20} />
            </Link>
            <Link href="mailto:info@acossaenterprise.com" className="hover:text-rose-200 hover:scale-110 transition-transform">
              <Mail size={20} />
            </Link>
          </div>
        </div>

        {/* SHOP MAP */}
        <div>
          <h4 className="text-lg font-semibold mb-4 border-b border-rose-400/30 pb-2 inline-block">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-white text-rose-100 transition-colors">All Products</Link></li>
            <li><Link href="/category/sarees" className="hover:text-white text-rose-100 transition-colors">Sarees</Link></li>
            <li><Link href="/category/lehengas" className="hover:text-white text-rose-100 transition-colors">Lehengas</Link></li>
            <li><Link href="/category/gowns" className="hover:text-white text-rose-100 transition-colors">Gowns</Link></li>
            <li><Link href="/category/suits" className="hover:text-white text-rose-100 transition-colors">Kurti & Suit Sets</Link></li>
          </ul>
        </div>

        {/* CUSTOMER CARE */}
        <div>
          <h4 className="text-lg font-semibold mb-4 border-b border-rose-400/30 pb-2 inline-block">Customer Care</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shipping" className="hover:text-white text-rose-100 transition-colors">Shipping Policy</Link></li>
            <li><Link href="/return" className="hover:text-white text-rose-100 transition-colors">Return Policy</Link></li>
            <li><Link href="/refund" className="hover:text-white text-rose-100 transition-colors">Refund Policy</Link></li>
            <li><Link href="/privacy" className="hover:text-white text-rose-100 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white text-rose-100 transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* CONTACT & COMPANY INFO */}
        <div>
          <h4 className="text-lg font-semibold mb-4 border-b border-rose-400/30 pb-2 inline-block">Contact Us</h4>
          <ul className="text-sm space-y-4">
            <li className="flex items-start gap-3">
              <Phone size={18} className="mt-1 flex-shrink-0 text-rose-200" />
              <span>+91 96380 00593</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={18} className="mt-1 flex-shrink-0 text-rose-200" />
              <span>info@acossaenterprise.com</span>
            </li>
            <li className="pt-2 border-t border-rose-800/50">
              <p className="leading-relaxed text-rose-100 text-xs opacity-80">
                Feather International Private Limited <br />
                B-2, 303, Anand Vatika, Satellite Road, <br />
                Motavarachha, Surat – 394101, India
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative z-10 mt-12 border-t border-rose-800/50 pt-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-rose-200/80 gap-2">
           <p>© {new Date().getFullYear()} ACOSAA. All rights reserved.</p>
           <p>Designed with ❤️ in India</p>
           <p>Developed by ThinQit Media</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;