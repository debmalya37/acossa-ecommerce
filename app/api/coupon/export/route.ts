import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import CouponModel from "@/models/Coupon";

/* -------------------------------------------------------
   GET → Export All Active Coupons (deletedAt = null)
-------------------------------------------------------- */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Active coupons only
    const filter = { deletedAt: null };

    const coupons = await CouponModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    if (!coupons || coupons.length === 0) {
      return response(false, 404, "Collection empty.");
    }

    return response(true, 200, "Data found", coupons);
  } catch (error) {
    return catchError(error);
  }
}
