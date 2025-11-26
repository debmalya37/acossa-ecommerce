import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import zodSchema from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon";

/* -----------------------------------------
   PUT → Update a Coupon
----------------------------------------- */
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const payload = await request.json();

    /* -----------------------------------------
       Zod Validation
    ----------------------------------------- */
    const schema = zodSchema.pick({
      _id: true,
      code: true,
      minShoppingAmount: true,
      validity: true,
      discountPercentage: true,
    });

    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      return response(
        false,
        400,
        "Invalid or missing fields.",
        parsed.error
      );
    }

    const {
      _id,
      code,
      minShoppingAmount,
      validity,
      discountPercentage,
    } = parsed.data;

    /* -----------------------------------------
       Validate ObjectId
    ----------------------------------------- */
    if (!Types.ObjectId.isValid(_id)) {
      return response(false, 400, "Invalid coupon ID.");
    }

    /* -----------------------------------------
       Fetch Coupon
    ----------------------------------------- */
    const coupon = await CouponModel.findOne({
      _id: new Types.ObjectId(_id),
      deletedAt: null,
    });

    if (!coupon) {
      return response(false, 404, "Coupon not found.");
    }

    /* -----------------------------------------
       Update Fields
    ----------------------------------------- */
    coupon.code = code;
    coupon.minShoppingAmount = minShoppingAmount;
    coupon.discountPercentage = discountPercentage;

    // Convert validity to Date (required for safety)
    coupon.validity = new Date(validity);

    await coupon.save();

    return response(true, 200, "Coupon updated successfully.");
  } catch (error) {
    return catchError(error);
  }
}
