import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import zodSchema from "@/lib/zodSchema";
import MediaModel from "@/models/Media";
import { isValidObjectId } from "mongoose";
import z from "zod";

/* -------------------------------------------------------
   Extract Zod Schema (Typed)
-------------------------------------------------------- */
const updateMediaSchema = zodSchema.pick({
  _id: true,
  alt: true,
  title: true,
});

type UpdateMediaPayload = z.infer<typeof updateMediaSchema>;

/* -------------------------------------------------------
   PUT → Update Media Meta (alt, title)
-------------------------------------------------------- */
export async function PUT(request: NextRequest): Promise<Response> {
  try {
    // Optional auth
    // const auth = await isAuthenticated("admin");
    // if (!auth.isAuth) {
    //   return response(false, 403, "Unauthorized.");
    // }

    await dbConnect();

    const payload: UpdateMediaPayload = await request.json();

    // Validate input
    const validation = updateMediaSchema.safeParse(payload);
    if (!validation.success) {
      return response(false, 400, "Invalid or missing fields.", validation.error);
    }

    const { _id, alt, title } = validation.data;

    // Validate MongoDB ObjectId
    if (!isValidObjectId(_id)) {
      return response(false, 400, "Invalid media ID.");
    }

    // Fetch media
    const media = await MediaModel.findById(_id);
    if (!media) {
      return response(false, 404, "Media not found.");
    }

    // Update fields
    media.alt = alt;
    media.title = title;

    await media.save();

    return response(true, 200, "Media updated successfully!");
  } catch (error) {
    return catchError(error);
  }
}
