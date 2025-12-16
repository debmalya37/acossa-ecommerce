"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#16a34a", "#f59e0b", "#dc2626"];

export default function SEODashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    axios.get("/api/admin/seo/stats").then(res => {
      setStats(res.data);
    });
  }, []);

  if (!stats) return <p>Loading SEO dashboard…</p>;

  const pageChart = [
    { name: "Optimized", value: stats.pages.total - stats.pages.missing },
    { name: "Missing", value: stats.pages.missing },
  ];

  const productChart = [
    { name: "Optimized", value: stats.products.total - stats.products.missing },
    { name: "Missing", value: stats.products.missing },
  ];

  return (
    <div className="max-w-7xl space-y-10">
      <h1 className="text-2xl font-semibold">SEO Control Center</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Stat title="Pages SEO Score" value={`${stats.pages.avgScore}%`} />
        <Stat title="Products SEO Score" value={`${stats.products.avgScore}%`} />
        <Stat title="Pages Missing SEO" value={stats.pages.missing} />
        <Stat title="Products Missing SEO" value={stats.products.missing} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Chart title="Pages SEO Health" data={pageChart} />
        <Chart title="Products SEO Health" data={productChart} />
      </div>

      {/* NAV */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NavCard title="Pages SEO" href="/admin/seo/pages" />
        <NavCard title="Products SEO" href="/admin/seo/products" />
        <NavCard title="SEO Health" href="/admin/seo/health" />
      </div>
    </div>
  );
}

/* ---------- UI Components ---------- */

function Stat({ title, value }: any) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}

function Chart({ title, data }: any) {
  return (
    <div className="bg-white border rounded-xl p-6 h-[320px]">
      <h3 className="font-medium mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={70}>
            {data.map((_: any, i: number) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function NavCard({ title, href }: any) {
  return (
    <Link
      href={href}
      className="border rounded-xl p-6 bg-white hover:shadow-md transition"
    >
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">Manage & optimize</p>
    </Link>
  );
}
