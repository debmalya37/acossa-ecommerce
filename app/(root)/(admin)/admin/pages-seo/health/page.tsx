"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SEOHealth() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/pages-seo/health").then(res => {
      setPages(res.data.pages);
    });
  }, []);

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">SEO Health</h1>

      {pages.map((p: any) => (
        <div key={p.path} className="border rounded p-3 flex justify-between">
          <span>{p.path}</span>
          <span
            className={
              p.status === "good"
                ? "text-green-600"
                : p.status === "warning"
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {p.status}
          </span>
        </div>
      ))}
    </div>
  );
}
