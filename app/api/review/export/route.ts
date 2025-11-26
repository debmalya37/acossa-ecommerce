import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import ReviewModel from "@/models/Review";

/* --------------------------------------------------------
   GET → Export All Active Reviews (No Pagination)
--------------------------------------------------------- */

export async function GET(_: NextRequest): Promise<Response> {
  try {
    await dbConnect();

    const filter = { deletedAt: null };

    const reviews = await ReviewModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // If collection is empty
    if (!reviews || reviews.length === 0) {
      return response(false, 404, "Collection empty.");
    }

    return response(true, 200, "Data found", reviews);
  } catch (error) {
    return catchError(error);
  }
}
