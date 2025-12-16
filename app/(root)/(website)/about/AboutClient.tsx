"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, Globe, Sparkles } from "lucide-react";

const AboutClient = () => {
  return (
    <main className="relative bg-gradient-to-b from-[#fffaf6] via-white to-[#fff7f0] text-gray-800 overflow-hidden mt-40">
      {/* Decorative background accents */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-rose-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-amber-200/30 rounded-full blur-3xl" />

      {/* HERO */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="uppercase tracking-[0.3em] text-xs text-rose-600 mb-3">
          Since 2022 · Surat, India
        </p>

        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight text-gray-900">
          About <span className="text-rose-700">Acossa Enterprise</span>
        </h1>

        <div className="flex justify-center items-center mt-6 mb-8 gap-2 text-rose-500">
          <span className="h-[1px] w-16 bg-rose-300" />
          <Sparkles size={16} />
          <span className="h-[1px] w-16 bg-rose-300" />
        </div>

        <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-600 leading-relaxed">
          Surat’s trusted ethnic wear brand making premium Indian fashion
          affordable, stylish, and globally accessible.
        </p>
      </section>

      {/* STORY */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-5 text-gray-900">
            Our Story
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Founded in <strong>2022</strong>, Acossa Enterprise set out with a simple
            mission — to make premium Indian ethnic wear affordable, stylish, and
            globally accessible. Based in <strong>Surat</strong>, we work directly
            with skilled makers and trusted manufacturers to offer high-quality
            sarees, lehengas, salwar suits, kurti sets, and festive outfits —
            all at honest, direct-from-manufacturer pricing.
          </p>

          <p className="text-gray-700 leading-relaxed">
            As a growing global brand, we specialize in sarees with worldwide
            delivery, custom-stitched lehengas online, and Indian wedding outfits
            for abroad. Every outfit is crafted to drape beautifully, feel
            luxurious, and photograph perfectly — whether it’s weddings,
            garba nights, festivals, or daily wear.
          </p>
        </div>
      </section>

      {/* WHY ACOSSA */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-center text-2xl md:text-3xl font-serif font-semibold mb-10">
          Why Choose Acossa
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Direct-from-manufacturer ethnic wear",
            "Premium sarees and lehengas at sensible pricing",
            "Global shipping to USA, Canada, UK, Australia & Middle East",
            "Custom blouse stitching, fall and pico service",
            "Fresh, limited-edition collections",
            "Trusted B2B & B2C Indian ethnic wear supplier",
            "Fast dispatch from Surat, India",
            "Latest Indian ethnic fashion 2025 trends",
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-transform hover:-translate-y-1"
            >
              <p className="text-sm md:text-base text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GLOBAL PROMISE */}
      <section className="relative z-10 bg-gradient-to-r from-rose-700 to-rose-600 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Globe className="mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
            Made in India · Loved Worldwide
          </h2>
          <p className="text-rose-100 max-w-3xl mx-auto leading-relaxed">
            Our curated catalog features daily wear sarees at affordable prices,
            premium lehengas under budget, and the latest Indian ethnic fashion
            trends — giving customers worldwide designer-level outfits without
            showroom markups.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-gray-900">
            Need Sizing, Styling or Customization Help?
          </h2>

          <p className="text-gray-600 mb-8">
            Our WhatsApp team is always ready with quick assistance and expert
            guidance on sizing, styling, fabric selection, and customization.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="text-rose-600 mt-1" />
              <span>
                <strong>Email</strong>
                <br />
                info@acossaenterprise.com
              </span>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-rose-600 mt-1" />
              <span>
                <strong>WhatsApp / Call</strong>
                <br />
                +91 96380 00593
              </span>
            </div>
          </div>

          <div className="mt-8 text-xs text-gray-500 leading-relaxed">
            <strong>Registered Office</strong>
            <br />
            Feather International Pvt Ltd
            <br />
            303 Anand Vatika, Motavarachha,
            <br />
            Surat – 394101, India
          </div>

          <div className="mt-10">
            <Link
              href="/shop"
              className="inline-block px-8 py-3 rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 transition"
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTNOTE */}
      <section className="text-center pb-16 text-sm text-gray-500">
        <p className="italic">
          Acossa Enterprise — Shop confidently. Celebrate beautifully. Dress effortlessly.
        </p>
      </section>
    </main>
  );
};

export default AboutClient;
