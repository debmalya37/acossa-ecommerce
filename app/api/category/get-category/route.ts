import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import { isValidObjectId } from "mongoose";
import CategoryModel from "@/models/Category";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest) {
  try {

    await dbConnect();
    const category = await CategoryModel.find({deletedAt: null}).lean();
    if (!category) {
      return response(false, 404, "Category not found");
    }

    return response(true, 200, "Category found", category);
  } catch (error) {
    return catchError(error);
  }
}
