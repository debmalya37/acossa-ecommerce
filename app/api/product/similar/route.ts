// app/api/product/similar/route.ts
import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product";
import { response, catchError } from "@/lib/helper";
import { Types } from "mongoose";

/* -----------------------------
   Type
----------------------------- */
interface SimilarProduct {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  mrp: number;
  sellingPrice: number;
  media?: { secure_url: string }[];
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const exclude = searchParams.get("exclude");

    if (!exclude) {
      return response(false, 400, "Exclude product id is required");
    }

    let products: SimilarProduct[] = [];

    /* ----------------------------------
       1️⃣ SAME CATEGORY FIRST
    ---------------------------------- */
    if (category) {
      products = await ProductModel.find({
        category,
        deletedAt: null,
        _id: { $ne: exclude },
      })
        .select("name slug media sellingPrice mrp")
        .populate("media", "secure_url")
        .limit(8)
        .lean<SimilarProduct[]>();
    }

    /* ----------------------------------
       2️⃣ FALLBACK → ANY CATEGORY
    ---------------------------------- */
    if (!products.length) {
      products = await ProductModel.find({
        deletedAt: null,
        _id: { $ne: exclude },
      })
        .select("name slug media sellingPrice mrp")
        .populate("media", "secure_url")
        .limit(8)
        .lean<SimilarProduct[]>();
    }

    return response(true, 200, "Similar products fetched", products);
  } catch (error) {
    return catchError(error);
  }
}
