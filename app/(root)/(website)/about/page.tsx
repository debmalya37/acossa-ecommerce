import AboutClient from "./AboutClient";
import dbConnect from "@/lib/dbConnect";
import PageSEOModel from "@/models/pageSEO";
import { pageSeoFallback } from "@/lib/seoFallback";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  await dbConnect();
  const seo = await PageSEOModel.findOne({ path: "/about" });
  const fallback = pageSeoFallback("/about");

  return {
    title: seo?.title || fallback.title,
    description: seo?.description || fallback.description,
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
