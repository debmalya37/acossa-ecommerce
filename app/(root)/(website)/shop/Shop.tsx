/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, SlidersHorizontal, Grid3x3, LayoutGrid, Heart } from "lucide-react";
import Filter from "@/components/Application/Website/Filter";
import Link from "next/link";
import { PRODUCT_DETAILS } from "@/routes/WebsiteRoute";

type Size = "FS" | "XS" | "S" | "M" | "L" | "XL" | "XXL";
const SIZE_LABEL: Record<Size, string> = {
  FS: "Free Size",
  XS: "XS",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
};

type VariantFromAPI = { _id?: string; size?: string; color?: string; inStock?: boolean };
type MediaItem = { _id?: string; secure_url?: string; url?: string };
type ProductFromAPI = {
  _id: string;
  name: string;
  slug?: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage?: number;
  category?: { _id?: string; name?: string } | string;
  brand?: string;
  fabric?: string;
  occasion?: string;
  media?: MediaItem[];
  variants?: VariantFromAPI[];
  badge?: string;
  rating?: number;
  reviews?: number;
};

type ProductUI = {
  _id: string;
  name: string;
  slug?: string;
  image: string | null;
  mrp: number;
  sellingPrice: number;
  category: string | null;
  brand?: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  sizes: Size[];
  variants: VariantFromAPI[];
};

const ProductCard: React.FC<{ product: ProductUI }> = ({ product }) => {
  const [hover, setHover] = useState(false);

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-rose-100 relative"
    >
      <div className="relative aspect-[3/4] bg-gradient-to-b from-rose-50 to-white">
      <Link href={PRODUCT_DETAILS(product.slug)}>
        <img
          src={product.image ?? "/assets/placeholder.png"}
          alt={product.name}
          className={`w-full h-full object-cover rounded-b-2xl transition-all duration-700 ${hover ? "scale-105" : "scale-100"}`}
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-amber-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow">
            {product.badge}
          </span>
        )}

        <div className={`absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-3 transition-all duration-300 rounded-t-2xl shadow-md ${hover ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          <p className="text-xs font-medium text-rose-700 mb-2">Select Size</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {product.sizes.map((s) => (
              <button key={s} className="px-3 py-1 text-xs font-semibold rounded-full border border-rose-300 text-rose-700 hover:bg-rose-600 hover:text-white transition" onClick={() => alert(`${product.name} — ${s}`)}>
                {SIZE_LABEL[s] || "Free Size"}
              </button>
            ))}
          </div>
          <button className="w-full bg-rose-600 text-white py-2 rounded-xl font-medium shadow hover:bg-rose-700 transition">Quick View</button>
        </div>
        </Link>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          <button title="like" className="p-2 rounded-full hover:bg-rose-50 border border-rose-200">
            <Heart className="w-4 h-4 text-rose-600" />
          </button>
        </div>

        <p className="text-xs text-gray-500 uppercase mb-2">{product.category ?? "Uncategorized"}</p>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-red-700">₹{product.sellingPrice.toLocaleString("en-IN")}</span>
          {product.mrp && product.mrp > product.sellingPrice && <span className="text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString("en-IN")}</span>}
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>⭐ {product.rating ?? "—"} ({product.reviews ?? 0})</span>
        </div>
      </div>
    </article>
  );
};

const ShopPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryKey = useMemo(() => searchParams.toString(), [searchParams]);

  const selectedCategory = searchParams.get("category") || "all";
  const selectedSize = (searchParams.get("size") || "all") as string;
  const selectedColor = searchParams.get("color") || null;
  const selectedBrand = searchParams.get("brand") || null;
  const selectedFabric = searchParams.get("fabric") || null;
  const selectedOccasion = searchParams.get("occasion") || null;
  const selectedMaxPrice = searchParams.has("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
  const inStockOnly = searchParams.get("instock") === "1";

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [priceRangeLocal, setPriceRangeLocal] = useState<number>(70000);
  const [loading, setLoading] = useState<boolean>(true);
  const [productsRaw, setProductsRaw] = useState<ProductFromAPI[]>([]);
  const [filterData, setFilterData] = useState<any>({});

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(`/api/shop/products?${queryKey}`, { signal });
        if (!res.ok) {
          console.error("Fetch products status:", res.status);
          setProductsRaw([]);
          setFilterData({});
          return;
        }
        const json = await res.json();
        if (json?.success) {
          setProductsRaw(Array.isArray(json.data) ? json.data : []);
          setFilterData(json.filters ?? {});
        } else {
          setProductsRaw([]);
          setFilterData({});
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Fetch products error:", err);
        setProductsRaw([]);
        setFilterData({});
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
    return () => controller.abort();
  }, [queryKey]);

  const products: ProductUI[] = useMemo(() => {
    return productsRaw.map((p) => {
      const categoryName = typeof p.category === "string" ? p.category : p.category?.name ?? null;
      let imageUrl: string | null = null;
      if (Array.isArray(p.media) && p.media.length) {
        const first = p.media[0];
        imageUrl = first?.secure_url ?? (first as any)?.url ?? null;
      }
      const variants = Array.isArray(p.variants) ? p.variants : [];
      const sizesSet = new Set<Size>();
      variants.forEach((v) => {
        if (!v) return;
        const s = (v.size ?? "").toString().toUpperCase();
        if (["FS","XS","S","M","L","XL","XXL"].includes(s)) sizesSet.add(s as Size);
      });
      const sizes = Array.from(sizesSet) as Size[];

      return {
        _id: p._id,
        name: p.name,
        slug: p.slug,
        image: imageUrl,
        mrp: p.mrp,
        sellingPrice: p.sellingPrice,
        category: categoryName,
        brand: p.brand,
        badge: p.badge,
        rating: p.rating,
        reviews: p.reviews,
        sizes,
        variants,
      } as ProductUI;
    });
  }, [productsRaw]);

  const filtered = products;

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.push(`/shop${qs ? `?${qs}` : ""}`);
  };

  const clearFilters = () => {
    router.push("/shop");
  };

  const activeCount = [
    selectedCategory !== "all" ? 1 : 0,
    selectedSize !== "all" ? 1 : 0,
    selectedColor ? 1 : 0,
    selectedBrand ? 1 : 0,
    selectedFabric ? 1 : 0,
    selectedOccasion ? 1 : 0,
    inStockOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Hero */}
      <div className="relative h-64 md:h-80 rounded-b-[40px] overflow-hidden shadow-xl mb-4">
        <div className="absolute inset-0 bg-cover bg-center scale-[1.1] brightness-105" style={{ backgroundImage: "url('/assets/bridal-banner.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-rose-200/30 via-rose-50/10 to-rose-900/60 backdrop-blur-[2px]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-yellow-200/20 to-transparent" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[70%] bg-white/25 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
          <h1 className="text-rose-900 text-3xl md:text-4xl font-serif font-bold text-center">Luxury Bridal Collection</h1>
          <p className="text-center mt-2 text-rose-900/80 text-sm md:text-base leading-relaxed">
            Discover <span className="text-rose-700 font-medium">handwoven sarees</span>, couture lehengas and timeless heritage pieces designed for your once-in-a-lifetime celebration.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with Filter (desktop only) */}
          <aside className="w-full md:w-80 hidden md:block">
            <Filter
              filters={filterData}
              selectedCategory={selectedCategory}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              selectedBrand={selectedBrand}
              selectedFabric={selectedFabric}
              selectedOccasion={selectedOccasion}
              selectedMaxPrice={selectedMaxPrice ?? null}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
            />
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">Showing</div>
                  <div className="text-rose-900 font-semibold">{filtered.length}</div>
                  <div className="text-sm text-gray-500">results</div>
                </div>
                <div className="mt-1 text-xs text-gray-500">Curated for weddings & celebrations</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 border rounded-lg px-2 py-1 bg-white">
                  <button onClick={() => setGridCols(3)} className={`${gridCols === 3 ? "text-rose-900" : "text-gray-500"}`}><Grid3x3 /></button>
                  <button onClick={() => setGridCols(4)} className={`${gridCols === 4 ? "text-rose-900" : "text-gray-500"}`}><LayoutGrid /></button>
                </div>

                <button onClick={() => setMobileFiltersOpen(true)} className="md:hidden inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border">
                  <SlidersHorizontal /> Filters {activeCount > 0 && <span className="ml-2 bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full">{activeCount}</span>}
                </button>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="py-16 text-center text-gray-600">Loading products...</div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-gray-600">
                <h3 className="text-xl font-medium">No products match your filters</h3>
                <p className="mt-2">Try removing some filters or increase the price range</p>
                <button onClick={clearFilters} className="mt-4 px-5 py-2 bg-rose-700 text-white rounded-lg">Clear filters</button>
              </div>
            ) : (
              <div className={`grid grid-cols-2 ${gridCols === 3 ? "md:grid-cols-3" : "md:grid-cols-4"} gap-6`}>
                {filtered.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Drawer (keeps minimal controls) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-lg flex items-center gap-2"> Filters</h4>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 rounded-full hover:bg-gray-100"><X /></button>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium mb-2">Size</h5>
                <div className="flex flex-wrap gap-2">
                  {(["FS","XS","S","M","L","XL","XXL"] as Size[]).map((s) => {
                    const active = selectedSize === s;
                    return (
                      <button key={s} onClick={() => updateFilter("size", active ? "all" : s)} className={`px-3 py-1 rounded-full text-sm ${active ? "bg-rose-900 text-white" : "bg-white border"}`}>{SIZE_LABEL[s]}</button>
                    );
                  })}
                </div>
              </div>

              {/* <div>
                <h5 className="text-sm font-medium mb-2">Max price</h5>
                <input type="range" min={10000} max={70000} step={1000} value={priceRangeLocal} onChange={(e) => setPriceRangeLocal(Number(e.target.value))} className="w-full" />
              </div> */}

              <div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => updateFilter("instock", e.target.checked ? "1" : null)} className="w-4 h-4" />
                  <span className="text-sm">In stock only</span>
                </label>
              </div>

              <div className="flex gap-2">
                <button onClick={() => { clearFilters(); setMobileFiltersOpen(false); }} className="flex-1 py-2 border rounded-lg">Clear</button>
                <button onClick={() => setMobileFiltersOpen(false)} className="flex-1 py-2 bg-rose-700 text-white rounded-lg">Show {filtered.length} results</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
