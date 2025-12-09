/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import CartPage from "@/components/Application/Website/Cart";
import axios from "axios";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/reducer/authReducer";
import { useRouter } from "next/navigation";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const auth = useSelector((state: any) => state.authStore.auth);

  // ============================
  // FETCH SAREE CATEGORIES
  // ============================
  const [sareeCategories, setSareeCategories] = useState<
    { _id: string; name: string; slug: string }[]
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_URL;
        const { data } = await axios.get(`${base}/api/category?size=50`);

        if (data.success) {
          setSareeCategories(
            data.data.filter((cat: any) =>
              cat.slug?.toLowerCase().includes("saree")
            )
          );
        }
      } catch (error) {
        console.log("Category fetch error:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    dispatch(logout());
    router.push("/auth/login");
  };

  // ============================
  // SHARED NAV STRUCTURE
  // ============================
  const navLinks = [
    { label: "Shop", href: "/shop" },
    {
      label: "Sarees",
      children: sareeCategories.map((c) => ({
        label: c.name,
        href: `/shop?category=${c._id}`,
      })),
    },
    {
      label: "Lehengas",
      children: [
        { label: "Bridal Lehengas", href: "/shop" },
        { label: "Designer Lehengas", href: "/shop" },
        { label: "Wedding Lehengas", href: "/shop" },
      ],
    },
    {
      label: "Suits & Sets",
      children: [
        { label: "Anarkali Sets", href: "/shop" },
        { label: "Sharara Sets", href: "/shop" },
        { label: "Palazzo Sets", href: "/shop" },
      ],
    },
    { label: "New Arrivals", href: "/shop" },
    { label: "Wholesale", href: "/wholesaler" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      {/* ---------- Top Bar ---------- */}
      <div className="bg-black text-white text-xs py-2 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-10 px-10">
          <span>DUTY PAID SERVICE AVAILABLE IN USA</span>
          <span>•</span>
          <span>FREE SHIPPING WORLDWIDE</span>
          <span>•</span>
          <span>HANDCRAFTED IN INDIA</span>
        </div>
      </div>

      {/* ---------- Header ---------- */}
      <div className="px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          {/* Logo */}
          <Link href="/">
            <img
              src="/assets/images/logo/acossa.jpg"
              className="h-16 md:h-24 object-contain"
              alt="ACOSSA"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
  {navLinks.map((nav) => (
    <div key={nav.label} className="relative group">
      {!nav.children ? (
        <Link
          href={nav.href!}
          className="hover:text-rose-600 transition"
        >
          {nav.label}
        </Link>
      ) : (
        <>
          <button
            type="button"
            className="flex items-center gap-1 hover:text-rose-600 transition"
          >
            {nav.label}
            <ChevronDown size={14} />
          </button>

          {/* ✅ DROPDOWN */}
          <div
            className="
              absolute 
              left-0 
              top-full 
              mt-3
              w-60
              bg-white
              border
              shadow-xl
              rounded-md
              opacity-0
              invisible
              translate-y-2
              group-hover:opacity-100
              group-hover:visible
              group-hover:translate-y-0
              transition-all
              duration-200
              z-50
            "
          >
            {nav.children.map((child) => (
              <Link
                key={child.label}
                href={child.href}
                className="
                  block 
                  px-4 
                  py-2.5 
                  text-sm 
                  hover:bg-rose-50 
                  hover:text-rose-600
                  transition
                "
              >
                {child.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  ))}
</nav>


          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {!auth ? (
              <>
                <Link href="/auth/login">Login</Link>
                <Link
                  href="/auth/register"
                  className="border px-3 py-1 rounded"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-red-600">
                Logout
              </button>
            )}

            <Link href="/my-account">
              <User size={20} />
            </Link>
            <CartPage />
          </div>
        </div>
      </div>

      {/* ---------- Mobile Menu ---------- */}
      {mobileMenuOpen && (
  <div className="md:hidden bg-white border-t shadow">
    {navLinks.map((nav) => (
      <div key={nav.label} className="border-b">
        {nav.children ? (
          <>
            {/* DROPDOWN BUTTON */}
            <button
              className="w-full px-4 py-3 flex justify-between items-center"
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === nav.label ? null : nav.label
                )
              }
            >
              {nav.label}
              <ChevronDown size={18} />
            </button>

            {/* DROPDOWN ITEMS */}
            {activeDropdown === nav.label && (
              <div className="bg-gray-50">
                {nav.children.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    className="block px-6 py-2 text-sm hover:text-rose-600"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveDropdown(null);
                    }}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          /* ✅ SINGLE LINK ONLY */
          <Link
            href={nav.href!}
            className="block px-4 py-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            {nav.label}
          </Link>
        )}
      </div>
    ))}
  </div>
)}

    </header>
  );
};

export default Header;
