import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import ProductModel from "@/models/Product";

/* ------------------------------------------
   Types for Payload
------------------------------------------- */
interface DeletePayload {
  ids: string[];
  deleteType: "SD" | "RSD" | "PD";
}

/* =========================================================
   PUT → Soft Delete / Restore (SD or RSD)
========================================================= */
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const payload: DeletePayload = await request.json();
    const { ids, deleteType } = payload;

    // Validate IDS
    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or Empty Id List");
    }

    // Check deleteType
    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "Invalid delete operation. Allowed types: SD, RSD."
      );
    }

    // Ensure products exist
    const products = await ProductModel.find({ _id: { $in: ids } })
      .select("_id")
      .lean();

    if (products.length === 0) {
      return response(false, 404, "Data not found.");
    }

    // SOFT DELETE
    if (deleteType === "SD") {
      await ProductModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );

      return response(true, 200, "Data moved into trash.");
    }

    // RESTORE
    await ProductModel.updateMany(
      { _id: { $in: ids } },
      { $set: { deletedAt: null } }
    );

    return response(true, 200, "Data restored.");
  } catch (error) {
    return catchError(error);
  }
}

/* =========================================================
   DELETE → Permanent Delete (PD)
========================================================= */
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const payload: DeletePayload = await request.json();
    const { ids, deleteType } = payload;

    // Validate ids
    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or Empty Id List");
    }

    // Validate deleteType
    if (deleteType !== "PD") {
      return response(
        false,
        400,
        "Invalid delete operation. Allowed type: PD (Permanent Delete)."
      );
    }

    // ensure data exists
    const products = await ProductModel.find({ _id: { $in: ids } })
      .select("_id")
      .lean();

    if (products.length === 0) {
      return response(false, 404, "Data not found.");
    }

    // Permanent delete
    await ProductModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Data deleted permanently.");
  } catch (error) {
    return catchError(error);
  }
}
