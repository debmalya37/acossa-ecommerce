import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import CategoryModel from "@/models/Category";
import { isValidObjectId } from "mongoose";

/* ----------------------------------------------------
   Types for Payload
-----------------------------------------------------*/
interface DeletePayload {
  ids: string[];
  deleteType: "SD" | "RSD" | "PD";
}

/* ----------------------------------------------------
   PUT → Soft Delete & Restore Category
-----------------------------------------------------*/
export async function PUT(request: NextRequest) {
  try {
    // Optional admin authentication
    // const auth = await isAuthenticated("admin");
    // if (!auth.isAuth) return response(false, 403, "Unauthorized");

    await dbConnect();

    const payload: DeletePayload = await request.json();
    const { ids, deleteType } = payload;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty ID list.");
    }

    // Validate all ObjectIds
    for (const id of ids) {
      if (!isValidObjectId(id)) {
        return response(false, 400, `Invalid ObjectId: ${id}`);
      }
    }

    const existing = await CategoryModel.find({ _id: { $in: ids } }).lean();

    if (!existing.length) {
      return response(false, 404, "Data not found.");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "Invalid delete operation. Allowed: SD (Soft Delete), RSD (Restore)."
      );
    }

    if (deleteType === "SD") {
      await CategoryModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
      return response(true, 200, "Data moved to trash.");
    }

    // Restore Deleted
    await CategoryModel.updateMany(
      { _id: { $in: ids } },
      { $set: { deletedAt: null } }
    );

    return response(true, 200, "Data restored.");
  } catch (error) {
    return catchError(error);
  }
}

/* ----------------------------------------------------
   DELETE → Permanent Delete Category
-----------------------------------------------------*/
export async function DELETE(request: NextRequest) {
  try {
    // const auth = await isAuthenticated("admin");
    // if (!auth.isAuth) return response(false, 403, "Unauthorized");

    await dbConnect();

    const payload: DeletePayload = await request.json();
    const { ids, deleteType } = payload;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty ID list.");
    }

    // Validate ObjectIds
    for (const id of ids) {
      if (!isValidObjectId(id)) {
        return response(false, 400, `Invalid ObjectId: ${id}`);
      }
    }

    const existing = await CategoryModel.find({ _id: { $in: ids } }).lean();
    if (!existing.length) {
      return response(false, 404, "Data not found.");
    }

    if (deleteType !== "PD") {
      return response(
        false,
        400,
        "Invalid delete operation. For permanent delete use PD."
      );
    }

    await CategoryModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Data deleted permanently.");
  } catch (error) {
    return catchError(error);
  }
}
