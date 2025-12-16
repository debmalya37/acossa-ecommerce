"use client";

import { use, useEffect, useState } from "react";
import axios from "axios";

const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;

export default function ProductSEO({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Unwrap params (Next.js 15)
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");
  const [seo, setSeo] = useState({
    title: "",
    description: "",
    keywords: "",
  });

  useEffect(() => {
    axios.get(`/api/admin/products/${id}/seo`).then(res => {
      const s = res.data.seo || {};
      setProductName(res.data.name || "");
      setSeo({
        title: s.title || "",
        description: s.description || "",
        keywords: (s.keywords || []).join(", "),
      });
      setLoading(false);
    });
  }, [id]);

  const save = async () => {
    await axios.patch(`/api/admin/products/${id}/seo`, {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords
        .split(",")
        .map(k => k.trim())
        .filter(Boolean),
    });
    alert("SEO updated successfully");
  };

  const autoGenerate = () => {
    setSeo({
      title: `${productName} Saree Online | Acossa Enterprise`,
      description: `Buy ${productName} saree at best price. Premium quality fabric with fast delivery.`,
      keywords: `${productName}, saree, buy saree online, acossa`,
    });
  };

  const seoScore =
    seo.title.length >= 30 &&
    seo.title.length <= TITLE_LIMIT &&
    seo.description.length >= 70 &&
    seo.description.length <= DESC_LIMIT
      ? "Good"
      : "Needs improvement";

  if (loading) return <p>Loading SEO…</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Product SEO</h1>
          <p className="text-sm text-gray-500">{productName}</p>
        </div>

        <span
          className={`px-3 py-1 rounded text-sm ${
            seoScore === "Good"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          SEO: {seoScore}
        </span>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <p className="text-blue-700 text-lg">
          {seo.title || "Product title will appear here"}
        </p>
        <p className="text-sm text-gray-600">
          https://acossaenterprise.com/products/...
        </p>
        <p className="text-sm text-gray-700 mt-2">
          {seo.description || "Meta description preview"}
        </p>
      </div>

      <div className="space-y-4">
        <label className="block font-medium">Meta Title</label>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Meta Title"
          value={seo.title}
          onChange={e => setSeo({ ...seo, title: e.target.value })}
        />
        <label className="block font-medium">Meta Description</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={4}
          placeholder="Meta Description"
          value={seo.description}
          onChange={e =>
            setSeo({ ...seo, description: e.target.value })
          }
        />
        <label className="block font-medium">
            Keywords (comma separated)
          </label>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Keywords (comma separated)"
          value={seo.keywords}
          onChange={e => setSeo({ ...seo, keywords: e.target.value })}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={save}
          className="bg-black text-white px-5 py-2 rounded"
        >
          Save SEO
        </button>

        <button
          onClick={autoGenerate}
          className="border px-5 py-2 rounded"
        >
          Auto Generate
        </button>
      </div>
    </div>
  );
}
