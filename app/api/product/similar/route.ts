// app/api/product/similar/route.ts
import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product";
import { response, catchError } from "@/lib/helper";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const exclude = searchParams.get("exclude");

    if (!exclude) {
      return response(false, 400, "Exclude product id is required");
    }

    // --------------------------------------------------
    // 1️⃣ TRY SAME CATEGORY FIRST
    // --------------------------------------------------
    let products = [];

    if (category) {
      products = await ProductModel.find({
        category,
        deletedAt: null,
        _id: { $ne: exclude },
      })
        .select("name slug media sellingPrice mrp")
        .populate("media", "secure_url")
        .limit(8)
        .lean();
    }

    // --------------------------------------------------
    // 2️⃣ FALLBACK → ANY CATEGORY (IF EMPTY)
    // --------------------------------------------------
    if (!products.length) {
      products = await ProductModel.find({
        deletedAt: null,
        _id: { $ne: exclude },
      })
        .select("name slug media sellingPrice mrp")
        .populate("media", "secure_url")
        .limit(8)
        .lean();
    }

    return response(true, 200, "Similar products fetched", products);
  } catch (error) {
    return catchError(error);
  }
}
