import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductAddonModel from "@/models/ProductAddon";

export async function GET() {
  await dbConnect();

  const addons = await ProductAddonModel.find({ deletedAt: null })
    .populate("product", "name")
    .sort({ sortOrder: 1 });

  return NextResponse.json({
    success: true,
    addons,
  });
}
