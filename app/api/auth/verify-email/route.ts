import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { isValidObjectId } from "mongoose";

import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import UserModel from "@/models/User";

/**
 * POST /api/auth/verify-email
 * Body: { token: string }
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // ✅ Parse body
    const body: { token?: string } = await request.json();

    if (!body.token) {
      return response(false, 400, "Missing verification token");
    }

    // ✅ Verify JWT
    const secret = new TextEncoder().encode(process.env.SECRET_KEY!);

    const { payload } = await jwtVerify(body.token, secret);

    const userId = payload.userId as string | undefined;

    if (!userId || !isValidObjectId(userId)) {
      return response(false, 400, "Invalid token or user");
    }

    // ✅ Find user
    const user = await UserModel.findById(userId);

    if (!user) {
      return response(false, 404, "User not found");
    }

    // ✅ Already verified? (idempotent)
    if (user.isEmailVerified) {
      return response(true, 200, "Email already verified");
    }

    // ✅ Verify email
    user.isEmailVerified = true;
    await user.save();

    return response(true, 200, "Email successfully verified");
  } catch (error) {
    return catchError(error);
  }
}
