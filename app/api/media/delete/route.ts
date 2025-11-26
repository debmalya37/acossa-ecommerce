import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import MediaModel from "@/models/Media";
import cloudinary from "@/lib/cloudinary";

/* --------------------------------------------------------------------
   Payload Types
-------------------------------------------------------------------- */
interface MediaDeletePayload {
  ids: string[];
  deleteType: "SD" | "RSD" | "PD";
}

/* --------------------------------------------------------------------
   PUT → Soft Delete / Restore Media
   SD  = Soft Delete   (mark deletedAt = new Date)
   RSD = Restore Soft Deleted
-------------------------------------------------------------------- */
export async function PUT(request: NextRequest): Promise<Response> {
  try {
    // Optional authentication
    // const auth = await isAuthenticated("admin");
    // if (!auth.isAuth) return response(false, 403, "Unauthorized");

    await dbConnect();

    const payload: MediaDeletePayload = await request.json();
    const { ids, deleteType } = payload;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "Invalid delete operation. Use SD (soft delete) or RSD (restore)."
      );
    }

    const mediaFound = await MediaModel.find({ _id: { $in: ids } }).lean();

    if (!mediaFound.length) {
      return response(false, 404, "Media not found.");
    }

    // Perform actual update
    if (deleteType === "SD") {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date() } }
      );
    } else {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
    }

    return response(
      true,
      200,
      deleteType === "SD"
        ? "Media moved to trash."
        : "Media restored successfully."
    );
  } catch (error) {
    return catchError(error);
  }
}

/* --------------------------------------------------------------------
   DELETE → Permanently Delete Media
   PD = Permanent Delete
   - Removes DB record
   - Deletes Cloudinary files
   - Uses Mongo Transaction for consistency
-------------------------------------------------------------------- */
export async function DELETE(request: NextRequest): Promise<Response> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await dbConnect();

    const payload: MediaDeletePayload = await request.json();
    const { ids, deleteType } = payload;

    if (!Array.isArray(ids) || ids.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 400, "Invalid or empty id list.");
    }

    if (deleteType !== "PD") {
      await session.abortTransaction();
      session.endSession();
      return response(
        false,
        400,
        "Invalid deleteType. Permanent delete requires PD."
      );
    }

    // Fetch media inside transaction
    const mediaDocs = await MediaModel.find({ _id: { $in: ids } })
      .session(session)
      .lean();

    if (!mediaDocs.length) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 404, "Media not found.");
    }

    // Collect Cloudinary Public IDs
    const cloudinaryPublicIds = mediaDocs.map((m) => m.public_id);

    // DB deletion
    await MediaModel.deleteMany({ _id: { $in: ids } }).session(session);

    // Cloudinary deletion
    try {
      await cloudinary.api.delete_resources(cloudinaryPublicIds);
    } catch (cloudErr) {
      await session.abortTransaction();
      session.endSession();
      return response(
        false,
        500,
        "Failed to delete files from Cloudinary.",
        cloudErr as Record<string, unknown>
      );
    }

    // Everything OK → commit DB transaction
    await session.commitTransaction();
    session.endSession();

    return response(true, 200, "Media deleted permanently.");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return catchError(error);
  }
}
