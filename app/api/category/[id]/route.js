import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import { isValidObjectId } from "mongoose";
import CategoryModel from "@/models/Category";

/* ---------------------------------------------
   GET → Fetch Category by ID
---------------------------------------------- */

// type RouteContext = {
//   params: {
//     id: string;
//   };
// };

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid category ID.");
    }

    const category = await CategoryModel.findOne({
      _id: id,
      deletedAt: null,
    }).lean();

    if (!category) {
      return response(false, 404, "Category not found");
    }

    return response(true, 200, "Category found", category);
  } catch (error) {
    return catchError(error);
  }
}
