"use client";
import Link from "next/link";

const PAGES = [
  { slug: "home", label: "Home (/)" },
  { slug: "shop", label: "Shop (/shop)" },
  { slug: "about", label: "About (/about)" },
  { slug: "wholesaler", label: "Wholesaler (/wholesaler)" },
];

export default function PagesSEO() {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Pages SEO</h1>

      {PAGES.map(p => (
        <Link
          key={p.slug}
          href={`/admin/pages-seo/${p.slug}`}
          className="block border rounded px-4 py-3 hover:bg-gray-50"
        >
          {p.label}
        </Link>
      ))}
    </div>
  );
}
