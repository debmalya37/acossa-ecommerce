import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import { isValidObjectId } from "mongoose";
import ProductVariantModel from "@/models/Productvariant";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest) {
  try {

    await dbConnect();
    const getColor = await ProductVariantModel.distinct("color", {deletedAt: null}).lean();
    if (!getColor) {
      return response(false, 404, "Color not found");
    }

    return response(true, 200, "Color found", getColor);
  } catch (error) {
    return catchError(error);
  }
}
