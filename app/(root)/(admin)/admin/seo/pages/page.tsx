"use client";
import Link from "next/link";

const PAGES = [
  { path: "/", label: "Home" },
  { path: "/shop", label: "Shop" },
  { path: "/about", label: "About" },
  { path: "/wholesaler", label: "Wholesaler" },
];

export default function PagesSEOList() {
  return (
    <div className="max-w-4xl space-y-4">
      <h1 className="text-xl font-semibold">Pages SEO</h1>

      {PAGES.map(p => (
        <Link
          key={p.path}
          href={`/admin/pages-seo/${p.path === "/" ? "home" : p.path.slice(1)}`}
          className="flex justify-between items-center border rounded-lg p-4 hover:bg-gray-50"
        >
          <span>{p.label}</span>
          <span className="text-sm text-gray-500">{p.path}</span>
        </Link>
      ))}
    </div>
  );
}
