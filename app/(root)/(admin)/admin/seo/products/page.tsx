"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ProductsSEOList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/seo/products").then(res => {
      setProducts(res.data.products);
    });
  }, []);

  return (
    <div className="max-w-5xl space-y-4">
      <h1 className="text-xl font-semibold">Products SEO</h1>

      {products.map((p: any) => (
        <Link
          key={p._id}
          href={`/admin/product/${p._id}/seo`}
          className="flex justify-between border rounded-lg p-4 hover:bg-gray-50"
        >
          <span>{p.name}</span>
          <span
            className={
              p.score === "good"
                ? "text-green-600"
                : p.score === "warning"
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {p.score}
          </span>
        </Link>
      ))}
    </div>
  );
}
