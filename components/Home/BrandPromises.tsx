"use client";

import React from "react";
import {
  Truck,
  Headphones,
  CreditCard,
  Scissors,
  Handshake,
  LucideIndianRupee,
} from "lucide-react";
import { LuIndianRupee } from "react-icons/lu";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
  },
  {
    icon: Headphones,
    title: "Customer Support",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
  },
  {
    icon: Scissors,
    title: "Custom Fitting",
  },
  {
    icon: Handshake,
    title: "Empowering Weavers",
  },
  {
    icon: LucideIndianRupee,
    title: "Made in India",
  },
];

const BrandPromises = () => {
  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 text-center">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-4 group"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-200 group-hover:border-black transition">
                  <Icon className="w-7 h-7 text-black" />
                </div>

                <p className="text-sm font-medium tracking-wide text-gray-900">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandPromises;
