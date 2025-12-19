import { Suspense } from "react";
import ShopPage from "./Shop";

import dbConnect from "@/lib/dbConnect";
import PageSEOModel from "@/models/pageSEO";
import { pageSeoFallback } from "@/lib/seoFallback";
export const dynamic = "force-dynamic";
// ✅ ADD THIS
export async function generateMetadata() {
  await dbConnect();

  const seo = await PageSEOModel.findOne({ path: "/shop" });
  const fallback = pageSeoFallback("/shop");

  return {
    title: seo?.title || fallback.title,
    description: seo?.description || fallback.description,
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPage />
    </Suspense>
  );
}
