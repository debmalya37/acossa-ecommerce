"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

async function getBlogs() {
  const res = await fetch("/api/blog", { cache: "no-store" });
  return res.json();
}

export default function BlogClient() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getBlogs();
      setBlogs(data.blogs || []);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="mt-40 text-center">Loading blogs…</div>;
  }

  return (
    <section className="bg-white mt-40">
      {/* PAGE HEADER */}
      <div className="max-w-3xl mx-auto text-center px-4 mb-14">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
          Acossa Journal
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Stories, styling tips, trends, and inspiration from the world of
          Indian ethnic fashion.
        </p>
      </div>

      {/* BLOG GRID */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog: any) => (
            <Link
              key={blog._id}
              href={`/blog/${blog.slug}`}
              className="group block"
            >
              <div className="bg-neutral-100 rounded-2xl overflow-hidden mb-5">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-[220px] object-contain bg-neutral-100 group-hover:scale-[1.03] transition"
                />
              </div>

              {blog.categories?.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {blog.categories.slice(0, 2).map((c: string) => (
                    <span
                      key={c}
                      className="text-[11px] uppercase tracking-wider border px-3 py-1 rounded-full text-gray-500"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <h2 className="font-serif font-semibold text-xl mb-2 group-hover:underline">
                {blog.title}
              </h2>

              <p className="text-sm text-gray-600 line-clamp-3">
                {blog.excerpt}
              </p>

              <div className="mt-4 text-xs text-gray-500">
                {new Date(blog.createdAt).toDateString()}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
