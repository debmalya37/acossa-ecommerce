"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-rose-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-3xl font-bold tracking-wide">ACOSAA</h2>
          <p className="mt-3 text-sm text-rose-100 leading-relaxed">
            Handcrafted designer sarees & bridal couture — curated with elegance 
            and rooted in India’s textile heritage.
          </p>

          {/* Social */}
          <div className="flex gap-4 mt-5">
            <Link href="#" className="hover:text-rose-200">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="hover:text-rose-200">
              <Facebook size={20} />
            </Link>
            <Link href="#" className="hover:text-rose-200">
              <Youtube size={20} />
            </Link>
            <Link href="mailto:info@acossaenterprise.com" className="hover:text-rose-200">
              <Mail size={20} />
            </Link>
          </div>
        </div>

        {/* SHOP MAP */}
        <div>
          <h4 className="text-lg font-semibold">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-rose-200">All Products</Link></li>
            <li><Link href="/category/sarees" className="hover:text-rose-200">Sarees</Link></li>
            <li><Link href="/category/lehengas" className="hover:text-rose-200">Lehengas</Link></li>
            <li><Link href="/category/gowns" className="hover:text-rose-200">Gowns</Link></li>
            <li><Link href="/category/suits" className="hover:text-rose-200">Kurti & Suit Sets</Link></li>
          </ul>
        </div>

        {/* CUSTOMER CARE */}
        <div>
          <h4 className="text-lg font-semibold">Customer Care</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/shipping-policy" className="hover:text-rose-200">Shipping Policy</Link></li>
            <li><Link href="/return-policy" className="hover:text-rose-200">Return Policy</Link></li>
            <li><Link href="/refund-policy" className="hover:text-rose-200">Refund Policy</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-rose-200">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-rose-200">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* CONTACT & COMPANY INFO */}
        <div>
          <h4 className="text-lg font-semibold">Contact Us</h4>
          <ul className="mt-4 text-sm space-y-3">
            <li className="flex items-start gap-2">
              <Phone size={18} />
              <span>+91 96380 00593</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={18} />
              <span>info@acossaenterprise.com</span>
            </li>
            <li>
              <p className="leading-relaxed">
                Feather International Private Limited <br />
                B-2, 303, Anand Vatika, Satellite Road, <br />
                Motavarachha, Surat – 394101, India
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="mt-10 border-t border-rose-700 pt-4 text-center text-xs text-rose-200">
        © {new Date().getFullYear()} ACOSAA. All rights reserved.  
      </div>
    </footer>
  );
};

export default Footer;
