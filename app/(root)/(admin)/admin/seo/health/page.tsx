"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SEOHealth() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios.get("/api/admin/seo/health").then(res => {
      setData(res.data);
    });
  }, []);

  if (!data) return <p>Loading SEO health…</p>;

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-xl font-semibold">SEO Health</h1>

      <Section title="Pages">
        {data.pages.map((p: any) => (
          <Row key={p.path} label={p.path} status={p.status} />
        ))}
      </Section>

      <Section title="Products">
        {data.products.map((p: any) => (
          <Row key={p.name} label={p.name} status={p.status} />
        ))}
      </Section>
    </div>
  );
}

/* ---------- UI ---------- */

function Section({ title, children }: any) {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-3">
      <h2 className="font-medium">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, status }: any) {
  return (
    <div className="flex justify-between text-sm border-b py-2">
      <span>{label}</span>
      <span
        className={
          status === "good"
            ? "text-green-600"
            : status === "warning"
            ? "text-yellow-600"
            : "text-red-600"
        }
      >
        {status}
      </span>
    </div>
  );
}
