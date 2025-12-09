"use client";

import React from "react";
// import Link from "next/link"; // Commented out for preview environment
import { Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react";
import { BsLinkedin, BsPinterest, BsWhatsapp } from "react-icons/bs";

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
      {/* --- BACKGROUND IMAGE --- */}
<div className="absolute inset-0 z-0">
  {/* Desktop Background */}
  <img
    src="/assets/images/footer-bg-2.png"
    alt="Footer Background Desktop"
    className="hidden md:block w-full h-full object-cover object-bottom"
    onError={(e: any) => (e.currentTarget.style.display = "none")}
  />

  {/* Mobile Background */}
  <img
    src="/assets/images/footer-bg-mobile-2.png"
    alt="Footer Background Mobile"
    className="block md:hidden w-full h-full object-cover object-bottom"
    onError={(e: any) => (e.currentTarget.style.display = "none")}
  />

  {/* Optional overlay for readability */}
  <div className="absolute inset-0 bg-rose-900/20" />
</div>


      {/* --- CONTENT (Relative z-10 to sit on top of image) --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-3xl font-bold tracking-wide">ACOSSA</h2>
          <p className="mt-3 text-sm text-rose-100 leading-relaxed max-w-xs">
            Handcrafted designer sarees & bridal couture — curated with elegance 
            and rooted in India’s textile heritage.
          </p>

          {/* Social */}
          <div className="flex gap-4 mt-5">
            <Link href="https://www.instagram.com/acossaenterprise" className="hover:text-rose-200 hover:scale-110 transition-transform">
              <Instagram size={20} />
            </Link>
            <Link href="https://in.pinterest.com/Acossaenterprise/" className="hover:text-rose-200 hover:scale-110 transition-transform">
              <BsPinterest size={20} />
            </Link>
            <Link href="http://www.linkedin.com/in/harshgojaria" className="hover:text-rose-200 hover:scale-110 transition-transform">
              <BsLinkedin size={20} />
            </Link>
            <Link href="https://www.facebook.com/share/17WpRnhm3F/" className="hover:text-rose-200 hover:scale-110 transition-transform">
              <Facebook size={20} />
            </Link>
            <Link href="https://wa.me/919638000593" className="hover:text-rose-200 hover:scale-110 transition-transform">
              <BsWhatsapp size={20} />
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
            <li><Link href="/shop" className="hover:text-white text-rose-100 transition-colors">Sarees</Link></li>
            <li><Link href="/shop" className="hover:text-white text-rose-100 transition-colors">Lehengas</Link></li>
            <li><Link href="/shop" className="hover:text-white text-rose-100 transition-colors">Gowns</Link></li>
            <li><Link href="/shop" className="hover:text-white text-rose-100 transition-colors">Kurti & Suit Sets</Link></li>
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
            <li><Link href="/cancellation" className="hover:text-white text-rose-100 transition-colors">Cancellation Policy</Link></li>
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
                Motavarachha, Surat – 394101, India <br />
                CIN:U17299GJ2022PTC137811
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative z-10 mt-12 border-t border-rose-800/50 text-white pt-6 bg-gray-950/70">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-rose-200/80 gap-2 text-center text-align-center">
           <p></p>
           <span><br />
           <p>© {new Date().getFullYear()} ACOSSA. All rights reserved.</p>Designed with ❤️ in India</span>
           <p>Developed by <Link href='https://www.thinqit.in/'>ThinQit Media</Link></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;