import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId, Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import ProductVariantModel from "@/models/Productvariant";
import MediaModel from "@/models/Media";

/* -------------------------------------------------------
   GET → Fetch Single Product Variant by ID
-------------------------------------------------------- */
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    await dbConnect();

    const { id } = context.params as { id: string };

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid product variant ID.");
    }

    // Build filter
    const filter = {
      _id: new Types.ObjectId(id),
      deletedAt: null,
    };

    // Fetch variant + populate media
    const variant = await ProductVariantModel.findOne(filter)
      .populate("media", "_id secure_url")
      .lean();

    if (!variant) {
      return response(false, 404, "Product variant not found.");
    }

    return response(true, 200, "Product variant found.", variant);
  } catch (error) {
    return catchError(error);
  }
}
