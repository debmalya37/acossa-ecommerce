"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/Application/Admin/RichTextEditor";

export default function CreateBlogPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [categories, setCategories] = useState("");
  const [loading, setLoading] = useState(false);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post("/api/admin/blogs", {
        title,
        slug: slugify(title),
        excerpt,
        coverImage,
        content,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        categories: categories.split(",").map(c => c.trim()).filter(Boolean),
      });
      router.push("/admin/blogs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Create Blog Post</h1>
        <p className="text-sm text-gray-500">
          Write and publish articles for the website blog
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white border rounded-xl p-5">
            <label className="block text-sm font-medium mb-2">
              Blog Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="w-full text-lg font-medium border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white border rounded-xl p-5">
            <label className="block text-sm font-medium mb-2">
              Short Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Short summary for SEO and previews"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Content */}
          <div className="bg-white border rounded-xl p-5">
            <label className="block text-sm font-medium mb-3">
              Blog Content
            </label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="bg-white border rounded-xl p-5">
            <label className="block text-sm font-medium mb-2">
              Cover Image URL
            </label>
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover preview"
                className="mt-4 w-full h-40 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Tags */}
          <div className="bg-white border rounded-xl p-5">
            <label className="block text-sm font-medium mb-2">
              Tags
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="bridal, saree, wedding"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Categories */}
          <div className="bg-white border rounded-xl p-5">
            <label className="block text-sm font-medium mb-2">
              Categories
            </label>
            <input
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="Sarees, Fashion, Wedding"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Publish Button */}
          <div className="bg-white border rounded-xl p-5">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-lg bg-black text-white py-3 font-medium hover:bg-gray-900 transition disabled:opacity-50"
            >
              {loading ? "Publishing…" : "Publish Blog"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
