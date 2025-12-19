import { Suspense } from "react";
import dbConnect from "@/lib/dbConnect";
import PageSEOModel from "@/models/pageSEO";
import { pageSeoFallback } from "@/lib/seoFallback";
import PageClient from "./PageClient";

// 🔥 IMPORTANT: disable caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  await dbConnect();

  const seo = await PageSEOModel.findOne({ path: "/" }).lean();
  const fallback = pageSeoFallback("/");

  return {
    title: seo?.title || fallback.title,
    description: seo?.description || fallback.description,
  };
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageClient />
    </Suspense>
  );
}
