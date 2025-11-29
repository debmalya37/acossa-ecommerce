"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf3e8] flex items-center justify-center px-6">
      <div className="max-w-3xl mx-auto text-center">

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="text-sm tracking-widest uppercase text-rose-600">
            Page Not Found
          </span>
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[90px] md:text-[120px] font-serif font-bold text-rose-900 leading-none"
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-lg md:text-xl text-gray-700 max-w-xl mx-auto"
        >
          The page you’re looking for has wandered off like a loose silk drape.
        </motion.p>

        <p className="mt-2 text-gray-600 text-sm">
          But don’t worry — timeless elegance is just a click away.
        </p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="px-8 py-4 rounded-full bg-rose-900 text-white font-medium hover:bg-rose-800 transition"
          >
            Go to Home
          </Link>

          <Link
            href="/shop"
            className="px-8 py-4 rounded-full border border-rose-900 text-rose-900 font-medium hover:bg-rose-900 hover:text-white transition"
          >
            Explore Sarees
          </Link>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 text-xs text-gray-500"
        >
          ACOSSA Enterprise · Premium Indian Ethnic Wear
        </motion.p>
      </div>
    </div>
  );
}
