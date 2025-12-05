import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import orderModel from "@/models/Order";

/* -------------------------------------------------------
   GET → Export All Active Coupons (deletedAt = null)
-------------------------------------------------------- */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Active coupons only
    const filter = { deletedAt: null };

    const orders = await orderModel.find(filter).select('-products')
      .sort({ createdAt: -1 })
      .lean();

    if (!orders || orders.length === 0) {
      return response(false, 404, "Collection empty.");
    }

    return response(true, 200, "Data found", orders);
  } catch (error) {
    return catchError(error);
  }
}
