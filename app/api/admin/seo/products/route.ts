// /api/admin/seo/products/route.ts
import ProductModel from "@/models/Product";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const products = await ProductModel.find().select("name seo");

  const data = products.map(p => {
    let score = "good";
    if (!p.seo?.title || !p.seo?.description) score = "error";
    else if (p.seo.title.length < 30) score = "warning";

    return { _id: p._id, name: p.name, score };
  });

  return NextResponse.json({ products: data });
}
