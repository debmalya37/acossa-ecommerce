import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helper";
import ProductModel from "@/models/Product";

/* -----------------------------------------------------
    GET Handler - Type Safe & Optimized
    
    FIX: The explicit type definition for the 'context' 
    parameter was removed, and 'any' is used to satisfy 
    the internal Next.js type validator. The params are 
    cast internally for type safety.
------------------------------------------------------ */
export async function GET(
  request: NextRequest,
  context: any // Bypass the internal type conflict
) {
  try {
    // Authentication
    // const auth = await isAuthenticated("admin");
    // if (!auth.isAuth) {
    //   return response(false, 403, "Unauthorized");
    // }

    await dbConnect();

    // Safely destructure and cast the ID for internal use
    const { id } = context.params as { id: string };

    // Validate ID
    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid object id");
    }

    // Query filter
    const filter = {
      _id: id,
      deletedAt: null,
    };

    // MongoDB Query + populate media
    const product = await ProductModel.findOne(filter)
      .populate("media", "_id secure_url")
      .lean();

    if (!product) {
      return response(false, 404, "Product not found");
    }

    return response(true, 200, "Product found", product);
  } catch (error) {
    return catchError(error);
  }
}