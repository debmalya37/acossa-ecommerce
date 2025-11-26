import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import CategoryModel from "@/models/Category";

/* ---------------------------------------------------------
   GET → Export Categories (only non-deleted)
---------------------------------------------------------- */
export async function GET(request: NextRequest) {
  try {
    // Optional admin authentication
    // const auth = await isAuthenticated("admin");
    // if (!auth.isAuth) {
    //   return response(false, 403, "Unauthorized");
    // }

    await dbConnect();

    const filter = { deletedAt: null };

    // Fetch categories sorted by latest created
    const categories = await CategoryModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    if (!categories || categories.length === 0) {
      return response(false, 404, "Collection empty.");
    }

    return response(true, 200, "Data found", categories);
  } catch (error) {
    return catchError(error);
  }
}
