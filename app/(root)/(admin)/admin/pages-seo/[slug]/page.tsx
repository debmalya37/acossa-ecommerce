"use client";
import { use, useEffect, useState } from "react";
import axios from "axios";

const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;

export default function PageSEO({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [seo, setSeo] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/admin/pages-seo/${slug}`).then(res => {
      setSeo(res.data.seo || { title: "", description: "" });
      setLoading(false);
    });
  }, [slug]);

  const save = async () => {
    await axios.patch(`/api/admin/pages-seo/${slug}`, seo);
    alert("SEO saved");
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-semibold">Page SEO</h1>

      {/* Google Preview */}
      <div className="border p-4 rounded bg-gray-50">
        <p className="text-blue-700 text-lg">{seo.title || "Page title"}</p>
        <p className="text-sm text-gray-600">https://acossaenterprise.com/{slug === "home" ? "" : slug}</p>
        <p className="text-sm text-gray-700 mt-1">{seo.description || "Meta description preview"}</p>
      </div>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Meta Title"
        value={seo.title}
        onChange={e => setSeo({ ...seo, title: e.target.value })}
      />
      <p className="text-xs">{seo.title.length}/{TITLE_LIMIT}</p>

      <textarea
        className="w-full border rounded px-3 py-2"
        rows={4}
        placeholder="Meta Description"
        value={seo.description}
        onChange={e => setSeo({ ...seo, description: e.target.value })}
      />
      <p className="text-xs">{seo.description.length}/{DESC_LIMIT}</p>

      <button onClick={save} className="bg-black text-white px-5 py-2 rounded">
        Save SEO
      </button>
    </div>
  );
}
