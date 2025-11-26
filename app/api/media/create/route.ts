import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import cloudinary from "@/lib/cloudinary";
import { catchError, response } from "@/lib/helper";
import MediaModel from "@/models/Media";

/* ---------------------------------------------------------
   Types
--------------------------------------------------------- */
export interface MediaCreatePayload {
  public_id: string;
  secure_url: string;
  alt?: string;
  title?: string;
  [key: string]: unknown;
}

/* ---------------------------------------------------------
   POST → Create Media (Batch Upload)
--------------------------------------------------------- */
export async function POST(request: NextRequest): Promise<Response> {
  const payload = (await request.json()) as MediaCreatePayload[];

  try {
    // Optional authentication
    // const auth = await isAuthenticated("admin");
    // if (!auth.isAuth) return response(false, 403, "Unauthorized");

    await dbConnect();

    if (!Array.isArray(payload) || payload.length === 0) {
      return response(false, 400, "Payload must be a non-empty array.");
    }

    // Insert into database
    const newMedia = await MediaModel.insertMany(payload);

    return response(true, 200, "Media uploaded successfully.", newMedia);
  } catch (error: unknown) {
    // Rollback Cloudinary media if DB insertion fails
    if (Array.isArray(payload) && payload.length > 0) {
      const publicIds = payload.map((item) => item.public_id);

      try {
        await cloudinary.api.delete_resources(publicIds);
      } catch (deleteErr: unknown) {
        // Attach Cloudinary rollback error information
        const errWithCloudinary = {
          ...(error as Record<string, unknown>),
          cloudinaryError: deleteErr,
        };

        return catchError(errWithCloudinary);
      }
    }

    return catchError(error);
  }
}
