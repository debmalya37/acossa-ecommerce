/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  Loader2,
  ArrowRight
} from "lucide-react";
import CartPage from "@/components/Application/Website/Cart";
import axios from "axios";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/reducer/authReducer";
import { useRouter } from "next/navigation";
import { PRODUCT_DETAILS } from "@/routes/WebsiteRoute"; // Ensure this import exists

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const auth = useSelector((state: any) => state.authStore.auth);

  // ============================
  // SEARCH STATE
  // ============================
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // ============================
  // FETCH DYNAMIC CATEGORIES
  // ============================
  type Category = { _id: string; name: string; slug: string };
  const [sareeCategories, setSareeCategories] = useState<Category[]>([]);
  const [lehengaCategories, setLehengaCategories] = useState<Category[]>([]);
  const [suitCategories, setSuitCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_URL;
        const { data } = await axios.get(`${base}/api/category?size=100`);

        if (data.success) {
          const allCats = data.data;
          setSareeCategories(allCats.filter((c: any) => c.slug?.toLowerCase().includes("saree")));
          setLehengaCategories(allCats.filter((c: any) => c.slug?.toLowerCase().includes("lehenga")));
          setSuitCategories(allCats.filter((c: any) => c.slug?.toLowerCase().includes("suit") || c.slug?.toLowerCase().includes("set")));
        }
      } catch (error) {
        console.log("Category fetch error:", error);
      }
    };
    fetchCategories();
  }, []);

  // ============================
  // SEARCH LOGIC
  // ============================
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (query.length > 2) {
      setSearchLoading(true);
      searchTimeout.current = setTimeout(async () => {
        try {
          // Using the route we updated to fetch suggestions
          const { data } = await axios.get(`/api/shop/products?search=${query}&limit=5`);
          if (data.success) {
            setSuggestions(data.data);
          }
        } catch (err) {
          console.error("Search error", err);
        } finally {
          setSearchLoading(false);
        }
      }, 400); // Debounce of 400ms
    } else {
      setSuggestions([]);
      setSearchLoading(false);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${searchQuery}`); // Redirect to shop page with search results
      setSearchOpen(false);
      setSuggestions([]);
    }
  };

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    dispatch(logout());
    router.push("/auth/login");
  };

  const navLinks = [
    { label: "Shop", href: "/shop" },
    {
      label: "Sarees",
      children: sareeCategories.map((c) => ({ label: c.name, href: `/shop?category=${c._id}` })),
    },
    {
      label: "Lehengas",
      children: lehengaCategories.map((c) => ({ label: c.name, href: `/shop?category=${c._id}` })),
    },
    {
      label: "Suits & Sets",
      children: suitCategories.map((c) => ({ label: c.name, href: `/shop?category=${c._id}` })),
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

      {/* ---------- Header Main ---------- */}
      <div className="px-4 py-2 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          {/* Logo */}
          <Link href="/">
            <img src="/assets/images/logo/acossa.jpg" className="h-16 md:h-24 object-contain" alt="ACOSSA" />
          </Link>

          {/* Desktop Nav (Hidden when search is open) */}
          <nav className={`hidden md:flex items-center gap-8 ${searchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
            {navLinks.map((nav) => (
              <div key={nav.label} className="relative group">
                {!nav.children ? (
                  <Link href={nav.href!} className="hover:text-rose-600 transition">{nav.label}</Link>
                ) : (
                  <>
                    <button type="button" className="flex items-center gap-1 hover:text-rose-600 transition">
                      {nav.label} <ChevronDown size={14} />
                    </button>
                    <div className="absolute left-0 top-full mt-3 w-60 bg-white border shadow-xl rounded-md opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                      {nav.children.map((child) => (
                        <Link key={child.label} href={child.href} className="block px-4 py-2.5 text-sm hover:bg-rose-50 hover:text-rose-600 transition">
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
          <div className="flex items-center gap-4 relative z-50">
            {/* SEARCH TOGGLE BUTTON */}
            <button 
              onClick={() => {
                setSearchOpen(!searchOpen);
                if(!searchOpen) setTimeout(() => document.getElementById('search-input')?.focus(), 100);
              }} 
              className="hover:text-rose-600 transition"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {!auth ? (
              <>
                <Link href="/auth/login" className="hidden sm:block">Login</Link>
                <Link href="/auth/register" className="hidden sm:block border px-3 py-1 rounded">Sign Up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-red-600 hidden sm:block">Logout</button>
            )}

            <Link href="/my-account"><User size={20} /></Link>
            <CartPage />
          </div>
        </div>

        {/* ======================= */}
        {/* EXPANDABLE SEARCH BAR   */}
        {/* ======================= */}
        <div 
          className={`absolute inset-0 bg-white z-40 flex items-center justify-center transition-all duration-300 ${
            searchOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-5 opacity-0 invisible pointer-events-none"
          }`}
        >
          <div className="w-full max-w-2xl px-6 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for sarees, lehengas..."
                className="w-full text-lg md:text-xl border-b-2 border-gray-300 py-3 focus:outline-none focus:border-rose-600 bg-transparent"
                autoComplete="off"
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600">
                <ArrowRight />
              </button>
            </form>

            {/* SUGGESTIONS DROPDOWN (YouTube Style) */}
            {(searchQuery.length > 2 || searchLoading) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl rounded-b-xl border border-t-0 overflow-hidden z-50">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" /> Searching...
                  </div>
                ) : suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map((product) => (
                      <li key={product._id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                         <Link 
                           // Assuming PRODUCT_DETAILS is a function like (slug) => `/product/${slug}`
                           // If you don't have this imported, verify the route
                           href={product.slug ? `/product/${product.slug}` : '#'} 
                           className="flex items-center gap-3 px-4 py-3"
                           onClick={() => { setSearchOpen(false); setSuggestions([]); }}
                         >
                           <Search size={14} className="text-gray-400 min-w-[14px]" />
                           <span className="text-sm font-medium text-gray-700 line-clamp-1">{product.name}</span>
                         </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow max-h-[80vh] overflow-y-auto">
          {navLinks.map((nav) => (
            <div key={nav.label} className="border-b">
              {nav.children ? (
                <>
                  <button className="w-full px-4 py-3 flex justify-between items-center" onClick={() => setActiveDropdown(activeDropdown === nav.label ? null : nav.label)}>
                    {nav.label} <ChevronDown size={18} />
                  </button>
                  {activeDropdown === nav.label && (
                    <div className="bg-gray-50">
                      {nav.children.map((child) => (
                        <Link key={child.label} href={child.href} className="block px-6 py-2 text-sm hover:text-rose-600" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); }}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={nav.href!} className="block px-4 py-3" onClick={() => setMobileMenuOpen(false)}>
                  {nav.label}
                </Link>
              )}
            </div>
          ))}
          {auth && <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 border-b">Logout</button>}
        </div>
      )}
    </header>
  );
};

export default Header;