"use client";

import React, { useEffect, useMemo, useState } from "react";

type Size = "FS";

const SIZE_LABEL: Record<Size, string> = {
  FS: "Free Size",
  // XS: "XS",
  // S: "S",
  // M: "M",
  // L: "L",
  // XL: "XL",
  // XXL: "XXL",
};

type Category = { _id?: string; name?: string; slug?: string };
type FiltersShape = {
  categories?: Category[];
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  fabrics?: string[];
  occasions?: string[];
  priceRange?: { min: number; max: number };
};

type Props = {
  filters: FiltersShape;
  // read-only selected values (driven by URL/searchParams)
  selectedCategory?: string | null;
  selectedSize?: string | null;
  selectedColor?: string | null;
  selectedBrand?: string | null;
  selectedFabric?: string | null;
  selectedOccasion?: string | null;
  selectedMaxPrice?: number | null;

  // action handlers (should update URL/search params in parent)
  updateFilter: (key: string, value: string | null) => void;
  clearFilters: () => void;
};

export default function Filter({
  filters,
  selectedCategory,
  selectedSize,
  selectedColor,
  selectedBrand,
  selectedFabric,
  selectedOccasion,
  selectedMaxPrice,
  updateFilter,
  clearFilters,
}: Props) {
  const categories = filters?.categories ?? [];
  const sizes = (filters?.sizes ?? []) as string[];
  const colors = (filters?.colors ?? []) as string[];
  const brands = (filters?.brands ?? []) as string[];
  const fabrics = (filters?.fabrics ?? []) as string[];
  const occasions = (filters?.occasions ?? []) as string[];
  const priceRange = filters?.priceRange ?? { min: 0, max: 0 };

  // local slider state so we don't push for every tiny movement
  const [localMaxPrice, setLocalMaxPrice] = useState<number>(
    selectedMaxPrice ?? priceRange.max ?? 0
  );

  useEffect(() => {
    // whenever backend priceRange or selectedMaxPrice changes, sync local
    setLocalMaxPrice(selectedMaxPrice ?? priceRange.max ?? 0);
  }, [selectedMaxPrice, priceRange.max]);

  const onApplyPrice = () => {
    // send maxPrice param (minPrice left as 0 for now)
    if (!priceRange.max) return;
    updateFilter("maxPrice", String(localMaxPrice));
  };

  const onClearPrice = () => {
    setLocalMaxPrice(priceRange.max ?? 0);
    updateFilter("maxPrice", null);
  };

  // helper UI small components
  const ColorSwatch: React.FC<{ color: string; active?: boolean; onClick: () => void }> = ({ color, active, onClick }) => {
    // normalize color label to a safe CSS color where possible; if not, fallback to a small text swatch
    const safeColor = color.length <= 30 ? color : "transparent";
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-2 p-1 rounded-md border ${active ? "ring-2 ring-rose-500" : "border-gray-200"}`}
        title={color}
      >
        <span
          className="w-6 h-6 rounded-full border"
          style={{ backgroundColor: safeColor, borderColor: safeColor === "transparent" ? undefined : "#e5e7eb" }}
        />
        <span className="text-xs text-gray-700 line-clamp-1">{color}</span>
      </button>
    );
  };

  return (
    <div className="sticky top-28 bg-white/60 backdrop-blur rounded-2xl p-5 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-rose-800">Filters</h3>
        <button onClick={clearFilters} className="text-sm text-gray-600 hover:underline">Clear</button>
      </div>

      {/* CATEGORY */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
        <div className="flex flex-col gap-2 max-h-40 overflow-auto pr-1 text-black">
          <button
            onClick={() => updateFilter("category", "all")}
            className={`text-left px-2 py-1 rounded ${!selectedCategory || selectedCategory === "all" ? "bg-rose-100 text-rose-800" : "hover:bg-gray-50"}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={String(c._id ?? c.slug ?? c.name)}
              onClick={() => updateFilter("category", String(c._id ?? c.slug ?? c.name))}
              className={`text-left px-2 py-1 rounded ${selectedCategory === String(c._id ?? c.slug ?? c.name) ? "bg-rose-100 text-rose-800" : "hover:bg-gray-50"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* SIZES */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Size</h4>
        <div className="flex flex-wrap gap-2">
          {(["FS","XS","S","M","L","XL","XXL"] as Size[]).map((s) => {
            const isActive = selectedSize === s;
            return (
              <button
                key={s}
                onClick={() => updateFilter("size", isActive ? "all" : s)}
                className={`px-3 py-1 text-sm rounded-full border ${isActive ? "bg-rose-900 text-white border-rose-900" : "bg-white text-rose-800 border-gray-200"}`}
              >
                {SIZE_LABEL[s]}
              </button>
            );
          })}
        </div>
      </div>

      {/* COLORS */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Colors</h4>
        <div className="flex flex-col gap-2">
          {colors.length === 0 ? (
            <div className="text-xs text-gray-500">No colors available</div>
          ) : (
            colors.map((c) => (
              <ColorSwatch
                key={c}
                color={c}
                active={selectedColor === c}
                onClick={() => updateFilter("color", selectedColor === c ? "all" : c)}
              />
            ))
          )}
        </div>
      </div>

      {/* BRANDS */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Brand</h4>
        <div className="flex flex-col gap-2 max-h-36 overflow-auto pr-1">
          <button
            onClick={() => updateFilter("brand", "all")}
            className={`text-left px-2 py-1 rounded ${!selectedBrand || selectedBrand === "all" ? "bg-rose-100 text-rose-800" : "hover:bg-gray-50"}`}
          >
            All
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => updateFilter("brand", selectedBrand === b ? "all" : b)}
              className={`text-left px-2 py-1 rounded ${selectedBrand === b ? "bg-rose-100 text-rose-800" : "hover:bg-gray-50"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* FABRIC */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Fabric</h4>
        <div className="flex flex-col gap-2">
          <button onClick={() => updateFilter("fabric", "all")} className={`px-2 py-1 rounded ${!selectedFabric || selectedFabric === "all" ? "bg-rose-100 text-rose-800" : "hover:bg-gray-50"}`}>All</button>
          {fabrics.map((f) => (
            <button key={f} onClick={() => updateFilter("fabric", selectedFabric === f ? "all" : f)} className={`text-left px-2 py-1 rounded ${selectedFabric === f ? "bg-rose-100 text-rose-800" : "hover:bg-gray-50"}`}>{f}</button>
          ))}
        </div>
      </div>

      {/* OCCASION */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Occasion</h4>
        <div className="flex flex-col gap-2">
          <button onClick={() => updateFilter("occasion", "all")} className={`px-2 py-1 rounded ${!selectedOccasion || selectedOccasion === "all" ? "bg-rose-100 text-rose-800" : "hover:bg-gray-50"}`}>All</button>
          {occasions.map((o) => (
            <button key={o} onClick={() => updateFilter("occasion", selectedOccasion === o ? "all" : o)} className={`text-left px-2 py-1 rounded ${selectedOccasion === o ? "bg-rose-100 text-rose-800" : "hover:bg-gray-50"}`}>{o}</button>
          ))}
        </div>
      </div>

      {/* PRICE */}
       <div className="mb-4">
        {/* <h4 className="text-sm font-medium text-gray-700 mb-2">Max price</h4> */}
        {/* <div className="flex items-center gap-3">
          <input
            type="range"
            min={priceRange.min ?? 0}
            max={priceRange.max ?? 100000}
            step={100}
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
            className="w-full"
          />
          <div className="w-24 text-right text-xs">₹{localMaxPrice.toLocaleString("en-IN")}</div>
        </div> */}
        
        <div className="flex gap-2 mt-2">
          <button onClick={onApplyPrice} className="px-3 py-1 bg-rose-600 text-white rounded">Apply</button>
          <button onClick={onClearPrice} className="px-3 py-1 border rounded">Clear</button>
        </div>
      </div>
    </div>
  );
}
