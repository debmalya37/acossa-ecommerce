import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import ProductVariantModel from "@/models/Productvariant";

/* -------------------------------------------------------
   GET → Export All Product Variants (Without Media)
-------------------------------------------------------- */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Only fetch active variants
    const filter = { deletedAt: null };

    const variants = await ProductVariantModel.find(filter)
      .select("-media") // exclude media array
      .sort({ createdAt: -1 })
      .lean();

    if (!variants || variants.length === 0) {
      return response(false, 404, "No product variants found.");
    }

    return response(true, 200, "Data found.", variants);
  } catch (error) {
    return catchError(error);
  }
}
