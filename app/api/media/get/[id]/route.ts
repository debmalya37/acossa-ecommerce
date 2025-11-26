import { NextRequest, NextResponse } from "next/server";
import { catchError, response } from "@/lib/helper";
import MediaModel from "@/models/Media";
import { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/dbConnect";

/* -----------------------------------------------------
   GET → Fetch Single Media by ID
------------------------------------------------------ */
export async function GET(
  request: NextRequest,
  context: any 
) {
  try {
    // Optional Authentication
    // const auth = await isAuthenticated("admin");
    // if (!auth.isAuth) {
    //   return response(false, 403, "Unauthorized");
    // }

    await dbConnect();

    const { id } = context.params as { id: any};

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid media id.");
    }

    // Build filter
    const filter = {
      _id: id,
      deletedAt: null,
    };

    // Fetch media
    const media = await MediaModel.findOne(filter).lean();

    if (!media) {
      return response(false, 404, "Media not found.");
    }

    return response(true, 200, "Media found.", media);
  } catch (error) {
    return catchError(error);
  }
}
