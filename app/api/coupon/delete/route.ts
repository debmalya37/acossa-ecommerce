import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import CouponModel from "@/models/Coupon";

/** -----------------------------------------------
 *  PUT → Soft Delete / Restore Coupon
 *  SD  → Move To Trash   (deletedAt = now)
 *  RSD → Restore From Trash (deletedAt = null)
 * ---------------------------------------------- */
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const { ids = [], deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or Empty Id List");
    }

    const coupons = await CouponModel.find({ _id: { $in: ids } }).lean();

    if (!coupons.length) {
      return response(false, 404, "Data not found.");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "Invalid delete operation. Delete type should be SD or RSD for this route."
      );
    }

    if (deleteType === "SD") {
      await CouponModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
    } else {
      await CouponModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
    }

    return response(
      true,
      200,
      deleteType === "SD" ? "Data moved into trash." : "Data restored"
    );
  } catch (error) {
    return catchError(error);
  }
}

/** -----------------------------------------------
 *  DELETE → Permanently Delete Coupons
 *  PD → Permanent Delete
 * ---------------------------------------------- */
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { ids = [], deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or Empty Id List");
    }

    const coupons = await CouponModel.find({ _id: { $in: ids } }).lean();

    if (!coupons.length) {
      return response(false, 404, "Data not found.");
    }

    if (deleteType !== "PD") {
      return response(
        false,
        400,
        "Invalid delete operation. Delete type should be PD for this route."
      );
    }

    await CouponModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Data deleted permanently");
  } catch (error) {
    return catchError(error);
  }
}
