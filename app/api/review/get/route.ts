import { NextRequest } from "next/server";
import dbconnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import ReviewModel from "@/models/Review";
import { mongo } from "mongoose";
import type { PipelineStage } from "mongoose";
export async function GET(request: NextRequest) {
  try {
    await dbconnect();

    const searchParams = request.nextUrl.searchParams;

    const productId = searchParams.get("productId");
    const pageParam = Number(searchParams.get("page") ?? 0); // infiniteQuery starts from 0
    const limit = Number(searchParams.get("limit") ?? 10);

    const page = pageParam + 1; // convert 0 → 1
    const skip = (page - 1) * limit; // correct skip

    const matchQuery = {
      deletedAt: null,
      product: new mongo.ObjectId(productId || ""),
    };

    const aggregation: PipelineStage[] = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: { path: "$userData", preserveNullAndEmptyArrays: true },
      },
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit + 1 }, // 1 extra to detect next page
      {
        $project: {
          _id: 1,
          reviewedBy: "$userData.name",
          avatar: "$userData.avatar",
          rating: 1,
          title: 1,
          review: 1,
          createdAt: 1,
        },
      },
    ];

    const reviews = await ReviewModel.aggregate(aggregation);
    const totalReviews = await ReviewModel.countDocuments(matchQuery);

    let nextPage = undefined;

    if (reviews.length > limit) {
      nextPage = pageParam + 1; // next infiniteQuery page
      reviews.pop(); // remove extra item
    }

    return response(true, 200, "Reviews fetched successfully.", {
      reviews,
      nextPage,
      totalReviews,
    });

  } catch (error) {
    return catchError(error);
  }
}
