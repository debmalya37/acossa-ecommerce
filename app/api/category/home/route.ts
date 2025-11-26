import dbConnect from "@/lib/dbConnect";
import { catchError } from "@/lib/helper";
import CategoryModel from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const categories = await CategoryModel.aggregate([
      { $match: { deletedAt: null } },

      // Get 1 product from each category
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          pipeline: [
            { $match: { deletedAt: null } },
            { $project: { media: 1, name: 1, slug: 1 } },
            { $limit: 1 }
          ],
          as: "sample"
        }
      },

      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          sampleProduct: { $arrayElemAt: ["$sample", 0] }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    return catchError(error);
  }
}
