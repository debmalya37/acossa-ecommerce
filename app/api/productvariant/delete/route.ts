import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import ProductVariantModel from "@/models/Productvariant";
import { isValidObjectId } from "mongoose";

/* ---------------------------------------------------------
   PUT → Soft Delete (SD) or Restore (RSD)
--------------------------------------------------------- */
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const { ids, deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty ID list.");
    }

    // Validate all objectIds
    for (const id of ids) {
      if (!isValidObjectId(id)) {
        return response(false, 400, `Invalid ObjectId: ${id}`);
      }
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "Invalid delete operation. Delete type must be SD or RSD."
      );
    }

    const variants = await ProductVariantModel.find({ _id: { $in: ids } }).lean();
    if (!variants.length) {
      return response(false, 404, "Product variants not found.");
    }

    if (deleteType === "SD") {
      await ProductVariantModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date() } }
      );
      return response(true, 200, "Data moved to trash.");
    }

    if (deleteType === "RSD") {
      await ProductVariantModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
      return response(true, 200, "Data restored.");
    }

    return response(false, 400, "Unknown operation.");
  } catch (error) {
    return catchError(error);
  }
}

/* ---------------------------------------------------------
   DELETE → Permanent Delete (PD)
--------------------------------------------------------- */
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { ids, deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty ID list.");
    }

    // Validate ObjectIds
    for (const id of ids) {
      if (!isValidObjectId(id)) {
        return response(false, 400, `Invalid ObjectId: ${id}`);
      }
    }

    if (deleteType !== "PD") {
      return response(
        false,
        400,
        "Invalid delete operation. For permanent delete use deleteType='PD'."
      );
    }

    const variants = await ProductVariantModel.find({ _id: { $in: ids } }).lean();
    if (!variants.length) {
      return response(false, 404, "Product variants not found.");
    }

    await ProductVariantModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Data deleted permanently.");
  } catch (error) {
    return catchError(error);
  }
}
