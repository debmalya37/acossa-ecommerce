"use client";

import React from "react";

const WhatsAppButton = () => {
  const phoneNumber = "+919638000593"; // ✅ country code + number
  const message = "Hi, I have an enquiry";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-all"
    >
      {/* WhatsApp SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="white"
        className="w-7 h-7"
      >
        <path d="M16.001 3.2C9.372 3.2 4 8.353 4 14.698c0 2.548.95 4.91 2.547 6.764L4 28.8l7.573-2.419c1.773.927 3.771 1.45 4.43 1.45 6.628 0 12.001-5.153 12.001-11.499S22.629 3.2 16.001 3.2zm0 20.63c-1.416 0-2.787-.38-4.007-1.1l-.287-.17-4.493 1.436 1.436-4.207-.185-.277c-.85-1.277-1.304-2.762-1.304-4.282 0-4.403 3.966-7.984 8.84-7.984s8.84 3.58 8.84 7.984c0 4.403-3.966 7.983-8.84 7.983zm4.927-6.056c-.262-.13-1.547-.764-1.787-.851-.24-.087-.415-.13-.59.13-.173.262-.677.851-.83 1.027-.153.174-.306.196-.568.066-.26-.13-1.104-.406-2.103-1.294-.777-.692-1.302-1.547-1.456-1.808-.153-.262-.016-.403.115-.533.117-.116.262-.306.393-.458.132-.153.174-.262.262-.436.087-.174.044-.328-.022-.459-.066-.13-.59-1.418-.808-1.941-.212-.51-.426-.44-.59-.448l-.503-.01c-.174 0-.458.066-.7.328-.24.262-.917.897-.917 2.187 0 1.289.94 2.536 1.072 2.713.13.174 1.85 2.828 4.48 3.967.626.27 1.114.432 1.495.553.628.2 1.2.172 1.65.104.504-.075 1.547-.632 1.767-1.242.217-.611.217-1.132.153-1.242-.066-.11-.24-.174-.503-.306z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
