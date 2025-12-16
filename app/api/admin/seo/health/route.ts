// /api/admin/seo/health/route.ts
import PageSEOModel from "@/models/pageSEO";
import ProductModel from "@/models/Product";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const pages = await PageSEOModel.find();
  const products = await ProductModel.find().select("name seo");

  const pageHealth = pages.map(p => ({
    path: p.path,
    status:
      p.title && p.description
        ? "good"
        : "error",
  }));

  const productHealth = products.map(p => ({
    name: p.name,
    status:
      p.seo?.title && p.seo?.description
        ? "good"
        : "error",
  }));

  return NextResponse.json({
    pages: pageHealth,
    products: productHealth,
  });
}
