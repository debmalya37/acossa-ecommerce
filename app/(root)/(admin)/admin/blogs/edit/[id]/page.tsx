"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import RichTextEditor from "@/components/Application/Admin/RichTextEditor";
import ImageUpload from "@/components/Application/Admin/ImageUpload";

export default function EditBlogPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [categories, setCategories] = useState("");
  const [published, setPublished] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/admin/blogs/${id}`);
        const blog = res.data.blog;

        setTitle(blog.title);
        setExcerpt(blog.excerpt);
        setCoverImage(blog.coverImage);
        setContent(blog.content);
        setTags(blog.tags?.join(", ") || "");
        setCategories(blog.categories?.join(", ") || "");
        setPublished(blog.published);
      } catch (err) {
        console.error("Failed to load blog", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;

    setSaving(true);
    try {
      await axios.put(`/api/admin/blogs/${id}`, {
        title,
        excerpt,
        coverImage,
        content,
        published,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        categories: categories.split(",").map(c => c.trim()).filter(Boolean),
      });

      router.push("/admin/blogs");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-gray-500 dark:text-gray-400">
        Loading blog…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-gray-900 dark:text-gray-100">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">
          Edit Blog
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Update blog content, categories, and publish status
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* TITLE */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <label className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                w-full text-lg font-medium
                border border-gray-300 dark:border-gray-600
                rounded-lg px-4 py-3
                bg-white dark:bg-gray-800
                focus:ring-2 focus:ring-black dark:focus:ring-white
                outline-none
              "
            />
          </div>

          {/* EXCERPT */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <label className="block text-sm font-medium mb-2">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="
                w-full
                border border-gray-300 dark:border-gray-600
                rounded-lg px-4 py-3
                bg-white dark:bg-gray-800
                focus:ring-2 focus:ring-black dark:focus:ring-white
                outline-none
              "
            />
          </div>

          {/* CONTENT */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <label className="block text-sm font-medium mb-3">
              Blog Content
            </label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          {/* COVER */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <label className="block text-sm font-medium mb-2">
              Cover Image URL
            </label>
            <ImageUpload
  value={coverImage}
  onChange={(url) => setCoverImage(url)}
  
/>

            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                className="mt-4 h-40 w-full object-cover rounded-lg border dark:border-gray-700"
              />
            )}
          </div>

          {/* CATEGORIES */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <label className="block text-sm font-medium mb-2">
              Categories
            </label>
            <input
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="Sarees, Fashion"
              className="
                w-full
                border border-gray-300 dark:border-gray-600
                rounded-lg px-4 py-2
                bg-white dark:bg-gray-800
              "
            />
          </div>

          {/* TAGS */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <label className="block text-sm font-medium mb-2">
              Tags
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="bridal, wedding"
              className="
                w-full
                border border-gray-300 dark:border-gray-600
                rounded-lg px-4 py-2
                bg-white dark:bg-gray-800
              "
            />
          </div>

          {/* PUBLISHED */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 flex items-center justify-between">
            <span className="text-sm font-medium">
              Published
            </span>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-5 w-5 accent-black dark:accent-white"
            />
          </div>

          {/* ACTION */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="
                w-full
                rounded-lg
                bg-black text-white
                dark:bg-white dark:text-black
                py-3 font-medium
                hover:opacity-90
                disabled:opacity-50
                transition
              "
            >
              {saving ? "Saving…" : "Update Blog"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
