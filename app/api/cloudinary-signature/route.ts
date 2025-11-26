import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { catchError, response } from "@/lib/helper";

/** ----------------------------------------------------
 * Types
 * ----------------------------------------------------*/
interface CloudinarySignaturePayload {
  paramsToSign: Record<string, string | number>;
}

/** ----------------------------------------------------
 * POST → Generate Cloudinary Signature (Secure & Typed)
 * ----------------------------------------------------*/
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Parse JSON safely
    const payload: CloudinarySignaturePayload = await request.json();

    if (!payload || !payload.paramsToSign) {
      return response(false, 400, "Missing paramsToSign in request body.");
    }

    // Cloudinary Secret Validation
    if (!process.env.CLOUDINARY_SECRET_KEY) {
      return response(
        false,
        500,
        "Cloudinary secret key missing in environment variables."
      );
    }

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      payload.paramsToSign,
      process.env.CLOUDINARY_SECRET_KEY
    );

    return NextResponse.json({
      success: true,
      signature,
    });
  } catch (error) {
    return catchError(error);
  }
}
