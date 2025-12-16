"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateProductAddon() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    product: "",
    key: "FALL_PICO",
    label: "",
    type: "checkbox",
    basePrice: 0,
    required: false,
  });

  // ✅ USE EXISTING /api/product
  useEffect(() => {
    axios
      .get("/api/product", {
        params: {
          start: 0,
          size: 1000,      // enough for admin dropdown
          deleteType: "SD" // only active products
        },
      })
      .then(res => {
        setProducts(res.data.data || []);
      });
  }, []);

  const submit = async () => {
    await axios.post("/api/product-addon/create", form);
    router.push("/admin/productaddons");
  };

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">Create Product Addon</h1>

      {/* PRODUCT SELECT */}
      <select
        className="w-full border p-2 rounded"
        value={form.product}
        onChange={e => setForm({ ...form, product: e.target.value })}
      >
        <option value="">Select Product</option>
        {products.map(p => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        className="w-full border p-2 rounded"
        placeholder="Addon Label"
        onChange={e => setForm({ ...form, label: e.target.value })}
      />

      <select
        className="w-full border p-2 rounded"
        value={form.key}
        onChange={e => setForm({ ...form, key: e.target.value })}
      >
        {[
          "FALL_PICO",
          "EDGE_FINISH",
          "PRE_STITCHED",
          "SHAPEWEAR",
          "BLOUSE_STITCHING",
          "CUSTOM_NOTE",
        ].map(k => (
          <option key={k}>{k}</option>
        ))}
      </select>

      <select
        className="w-full border p-2 rounded"
        value={form.type}
        onChange={e => setForm({ ...form, type: e.target.value })}
      >
        <option value="checkbox">Checkbox</option>
        <option value="radio">Radio</option>
        <option value="select">Select</option>
      </select>

      <input
        type="number"
        className="w-full border p-2 rounded"
        placeholder="Base Price"
        onChange={e =>
          setForm({ ...form, basePrice: Number(e.target.value) })
        }
      />

      <label className="flex gap-2 items-center text-sm">
        <input
          type="checkbox"
          checked={form.required}
          onChange={e =>
            setForm({ ...form, required: e.target.checked })
          }
        />
        Required
      </label>

      <button
        onClick={submit}
        className="bg-black text-white px-5 py-2 rounded"
      >
        Create Addon
      </button>
    </div>
  );
}
