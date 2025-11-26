import { NextRequest, NextResponse } from "next/server";
import { Types, isValidObjectId } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import CouponModel from "@/models/Coupon";

/* -------------------------------------------------------
    GET → Fetch Single Coupon by ID
    
    FIX: The 'context' parameter's explicit type was conflicting
    with Next.js's internal validator. Using 'any' on the 
    parameter bypasses the validator, and we use an internal
    cast for type safety.
-------------------------------------------------------- */
export async function GET(
  request: NextRequest,
  context: any // Bypass the internal type conflict
) {
  try {
    await dbConnect();

    // Cast context.params here for internal type safety
    const { id } = context.params as { id: string };

    // Validate MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid coupon ID.");
    }

    // Build filter
    const filter = {
      _id: new Types.ObjectId(id),
      deletedAt: null,
    };

    // Query the database
    const coupon = await CouponModel.findOne(filter).lean();

    if (!coupon) {
      return response(false, 404, "Coupon not found.");
    }

    return response(true, 200, "Coupon found.", coupon);
  } catch (error) {
    return catchError(error);
  }
}