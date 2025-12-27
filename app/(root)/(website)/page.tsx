import { Suspense } from "react";
import dbConnect from "@/lib/dbConnect";
import PageSEOModel from "@/models/pageSEO";
import { pageSeoFallback } from "@/lib/seoFallback";
import PageClient from "./PageClient";

// ✅ Enable Caching (Update page once every 3600 seconds / 1 hour)
export const revalidate = 3600; 

// Helper to fetch data efficiently
async function getData() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Run all fetches in parallel for speed
  const [productsRes, categoriesRes, blogsRes] = await Promise.all([
    fetch(`${baseURL}/api/shop/home`, { next: { revalidate: 3600 } }),
    fetch(`${baseURL}/api/category/home?start=0&size=50`, { next: { revalidate: 3600 } }),
    fetch(`${baseURL}/api/blog?limit=3`, { next: { revalidate: 3600 } })
  ]);

  const productsData = productsRes.ok ? await productsRes.json() : { success: false };
  const categoriesData = categoriesRes.ok ? await categoriesRes.json() : { success: false };
  const blogsData = blogsRes.ok ? await blogsRes.json() : { blogs: [] };

  return {
    latest: productsData.latest || [],
    premium: productsData.premium || [],
    categories: categoriesData.data || [],
    blogs: blogsData.blogs || []
  };
}

export async function generateMetadata() {
  await dbConnect();
  const seo = await PageSEOModel.findOne({ path: "/" }).lean();
  const fallback = pageSeoFallback("/");
  return {
    title: seo?.title || fallback.title,
    description: seo?.description || fallback.description,
  };
}

export default async function Page() {
  // ✅ Fetch data on the server
  const data = await getData();

  return (
    <Suspense fallback={<div className="h-screen w-full bg-rose-50" />}>
      {/* Pass data down as props */}
      <PageClient 
        initialLatest={data.latest} 
        initialPremium={data.premium} 
        initialCategories={data.categories}
        initialBlogs={data.blogs}
      />
    </Suspense>
  );
}