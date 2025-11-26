import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import ReviewModel from "@/models/Review";

/* =====================================================
   PUT → Soft Delete & Restore Reviews (SD / RSD)
===================================================== */
export async function PUT(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();

    const { ids, deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty ID list.");
    }

    const found = await ReviewModel.find({ _id: { $in: ids } }).lean();

    if (!found.length) {
      return response(false, 404, "Data not found.");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "Invalid delete operation. Allowed: SD, RSD."
      );
    }

    if (deleteType === "SD") {
      await ReviewModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date() } }
      );
    } else {
      await ReviewModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
    }

    return response(
      true,
      200,
      deleteType === "SD"
        ? "Data moved to trash."
        : "Data restored successfully."
    );
  } catch (error) {
    return catchError(error);
  }
}

/* =====================================================
   DELETE → Permanent Delete (PD)
===================================================== */
export async function DELETE(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();

    const { ids, deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty ID list.");
    }

    const found = await ReviewModel.find({ _id: { $in: ids } }).lean();

    if (!found.length) {
      return response(false, 404, "Data not found.");
    }

    if (deleteType !== "PD") {
      return response(
        false,
        400,
        "Invalid delete operation. Only PD (Permanent Delete) allowed."
      );
    }

    await ReviewModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Data deleted permanently.");
  } catch (error) {
    return catchError(error);
  }
}
