"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Edit2, ExternalLink, PlusCircle, Trash2 } from "lucide-react";


interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
  tags?: string[];
  categories?: string[];
  createdAt: string;
}

export default function AdminBlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/admin/blogs");
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Failed to load blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
  const ok = confirm("Are you sure you want to delete this blog? This action cannot be undone.");

  if (!ok) return;

  try {
    await axios.delete(`/api/admin/blogs/${id}`);
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  } catch (err) {
    alert("Failed to delete blog");
  }
};


  return (
    <div className="max-w-7xl mx-auto p-8 text-gray-900 dark:text-gray-100">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Blogs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage all blog posts published on the website
          </p>
        </div>

        <Link
          href="/admin/blogs/create"
          className="
            inline-flex items-center gap-2 rounded-lg
            bg-black text-white
            dark:bg-white dark:text-black
            px-4 py-2
            hover:opacity-90 transition
          "
        >
          <PlusCircle size={18} />
          New Blog
        </Link>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          Loading blogs…
        </p>
      ) : blogs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No blogs created yet.
        </p>
      ) : (
        <div className="
          overflow-x-auto
          rounded-xl
          border
          border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
        ">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-left">
              <tr>
                {[
                  "Title",
                  "Status",
                  "Categories",
                  "Tags",
                  "Created",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="p-4 font-medium text-gray-700 dark:text-gray-300"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {blogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="
                    border-t
                    border-gray-200 dark:border-gray-700
                    hover:bg-gray-50 dark:hover:bg-gray-800
                    transition
                  "
                >
                  {/* TITLE */}
                  <td className="p-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {blog.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {blog.excerpt}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    {blog.published ? (
                      <span className="
                        rounded-full
                        bg-green-100 text-green-700
                        dark:bg-green-900/30 dark:text-green-400
                        px-3 py-1 text-xs
                      ">
                        Published
                      </span>
                    ) : (
                      <span className="
                        rounded-full
                        bg-yellow-100 text-yellow-700
                        dark:bg-yellow-900/30 dark:text-yellow-400
                        px-3 py-1 text-xs
                      ">
                        Draft
                      </span>
                    )}
                  </td>

                  {/* CATEGORIES */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {blog.categories?.length ? (
                        blog.categories.map((c) => (
                          <span
                            key={c}
                            className="
                              rounded
                              bg-gray-100 text-gray-700
                              dark:bg-gray-800 dark:text-gray-300
                              px-2 py-0.5 text-xs
                            "
                          >
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>

                  {/* TAGS */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags?.length ? (
                        blog.tags.map((t) => (
                          <span
                            key={t}
                            className="
                              rounded
                              bg-gray-100 text-gray-700
                              dark:bg-gray-800 dark:text-gray-300
                              px-2 py-0.5 text-xs
                            "
                          >
                            #{t}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>

                  {/* DATE */}
                  <td className="p-4 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 text-right">
  <div className="flex justify-end gap-3">
    {/* View */}
    <Link
      href={`/blog/${blog.slug}`}
      target="_blank"
      title="View Public Page"
      className="text-gray-500 hover:text-black transition"
    >
      <ExternalLink size={16} />
    </Link>

    {/* Edit */}
    <Link
      href={`/admin/blogs/edit/${blog._id}`}
      title="Edit Blog"
      className="text-gray-500 hover:text-black transition"
    >
      <Edit2 size={16} />
    </Link>

    {/* Delete */}
    <button
      onClick={() => handleDelete(blog._id)}
      title="Delete Blog"
      className="text-red-500 hover:text-red-700 transition"
    >
      <Trash2 size={16} />
    </button>
  </div>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
