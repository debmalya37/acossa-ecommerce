import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product";
import "@/models/Media";
import "@/models/Category";
import "@/models/Productvariant";
import "@/models/ProductAddon";
import "@/models/User";
import "@/models/Review";

export async function GET() {
  try {
    await dbConnect();

    const latest = await ProductModel.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("media", "secure_url")
      .lean();

    const premium = await ProductModel.find({ deletedAt: null })
      .sort({ discountPercentage: -1 })
      .limit(10)
      .populate("media", "secure_url")
      .lean();

    return NextResponse.json({
      success: true,
      latest,
      premium,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : typeof error === "string" ? error : "An unknown error occurred";
    return NextResponse.json({ success: false, message });
  }
}
