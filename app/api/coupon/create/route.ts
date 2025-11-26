import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import zodSchema from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon";

/* ---------------------------------------------
   POST → Create Coupon
---------------------------------------------- */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const payload = await request.json();

    // Validate using Zod schema
    const schema = zodSchema.pick({
      code: true,
      minShoppingAmount: true,
      validity: true,
      discountPercentage: true,
    });

    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      return response(false, 400, "Invalid or missing fields.", parsed.error);
    }

    const { code, minShoppingAmount, validity, discountPercentage } =
      parsed.data;

    // Create new coupon
    const newCoupon = new CouponModel({
      code,
      minShoppingAmount,
      validity,
      discountPercentage,
    });

    await newCoupon.save();

    return response(true, 200, "Coupon added successfully.");
  } catch (error) {
    return catchError(error);
  }
}
