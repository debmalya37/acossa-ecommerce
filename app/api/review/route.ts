import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError } from "@/lib/helper";
import ReviewModel from "@/models/Review";
import type { PipelineStage } from "mongoose";
/* ------------------------------------------------------
   GET → Paginated + Filtered + Searchable Reviews
------------------------------------------------------- */

export async function GET(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;

    // Pagination
    const start = Number(searchParams.get("start") || 0);
    const size = Number(searchParams.get("size") || 10);

    // Filters / Sorting / Search
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType");

    /* -----------------------------------------
       Build match conditions
    ----------------------------------------- */
    const matchQuery: Record<string, any> = {};

    if (deleteType === "SD") {
      matchQuery.deletedAt = null;
    } else if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    // Global search across multiple fields
    if (globalFilter) {
      matchQuery.$or = [
        { "productData.name": { $regex: globalFilter, $options: "i" } },
        { "userData.name": { $regex: globalFilter, $options: "i" } },
        { rating: { $regex: globalFilter, $options: "i" } },
        { title: { $regex: globalFilter, $options: "i" } },
        { review: { $regex: globalFilter, $options: "i" } },
      ];
    }

    // Column-based filtering
    filters.forEach((filter: any) => {
      if (filter.id === "product") {
        matchQuery["productData.name"] = { $regex: filter.value, $options: "i" };
      } else if (filter.id === "user") {
        matchQuery["userData.name"] = { $regex: filter.value, $options: "i" };
      } else {
        matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
      }
    });

    /* -----------------------------------------
       Sorting
    ----------------------------------------- */
    const sortQuery: Record<string, 1 | -1> = {};
    sorting.forEach((item: any) => {
      sortQuery[item.id] = item.desc ? -1 : 1;
    });

    /* -----------------------------------------
       Aggregate Pipeline
    ----------------------------------------- */
    const pipeline : PipelineStage[] = [
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },

      { $match: matchQuery },

      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },

      { $skip: start },
      { $limit: size },

      {
        $project: {
          _id: 1,
          product: "$productData.name",
          user: "$userData.name",
          rating: 1,
          review: 1,
          title: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    const reviews = await ReviewModel.aggregate(pipeline);

    const totalRowCount = await ReviewModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: reviews,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
