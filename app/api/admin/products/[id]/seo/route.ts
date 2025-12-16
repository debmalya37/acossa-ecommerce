// app/api/admin/products/[id]/seo/route.ts
import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/models/Product";
import dbConnect from "@/lib/dbConnect";

// ---------------------
// UPDATE SEO
// ---------------------
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params; // ✅ unwrap params
  const body = await req.json();

  const product = await ProductModel.findByIdAndUpdate(
    id,
    { seo: body },
    { new: true }
  );

  return NextResponse.json({
    success: true,
    seo: product?.seo || {},
  });
}

// ---------------------
// GET SEO
// ---------------------
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params; // ✅ unwrap params

  const product = await ProductModel.findById(id).select("seo name");

  return NextResponse.json({
    success: true,
    seo: product?.seo || {},
    name: product?.name || "",
  });
}
