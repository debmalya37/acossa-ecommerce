import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helper";
import ProductModel from "@/models/Product";

/* ----------------------------------------------------
   GET — Export Product List (Type-Safe & Optimized)
----------------------------------------------------- */
export async function GET(request: NextRequest) {
  try {
    // Authentication for admin
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    // Connect to MongoDB
    await dbConnect();

    // Only non-deleted products
    const filter = { deletedAt: null };

    // Fetch products but avoid heavy media/description fields
    const products = await ProductModel.find(filter)
      .select("-media -description")
      .sort({ createdAt: -1 })
      .lean();

    if (!products || products.length === 0) {
      return response(false, 404, "Collection empty.");
    }

    return response(true, 200, "Data found", products);
  } catch (error) {
    return catchError(error);
  }
}
