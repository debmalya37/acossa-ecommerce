import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { catchError } from "@/lib/helper";
import CouponModel from "@/models/Coupon";

/* -----------------------------------------
   Types for Query Parameters
----------------------------------------- */
interface ColumnFilter {
  id: string;
  value: string;
}

interface ColumnSort {
  id: string;
  desc: boolean;
}

type DeleteType = "SD" | "PD" | null;

/* -----------------------------------------
   GET → Fetch Paginated Coupon List
----------------------------------------- */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const params = request.nextUrl.searchParams;

    /* -----------------------------------------
       Parse Query Parameters Safely
    ----------------------------------------- */
    const start = Number(params.get("start") ?? 0);
    const size = Number(params.get("size") ?? 10);

    let filters: ColumnFilter[] = [];
    let sorting: ColumnSort[] = [];

    const globalFilter = params.get("globalFilter") || "";
    const deleteType = params.get("deleteType") as DeleteType;

    // Safe JSON parsing
    try {
      filters = JSON.parse(params.get("filters") || "[]");
      sorting = JSON.parse(params.get("sorting") || "[]");
    } catch {
      filters = [];
      sorting = [];
    }

    /* -----------------------------------------
       Build Match Query
    ----------------------------------------- */
    const matchQuery: Record<string, any> = {};

    // Soft Delete (SD = only active, PD = only deleted)
    if (deleteType === "SD") {
      matchQuery.deletedAt = null;
    } else if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    // Global filter search
    if (globalFilter) {
      matchQuery.$or = [
        { code: { $regex: globalFilter, $options: "i" } },

        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$minShoppingAmount" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$discountPercentage" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
      ];
    }

    /* -----------------------------------------
       Column-specific filters
    ----------------------------------------- */
    filters.forEach((filter) => {
      const { id, value } = filter;

      if (["minShoppingAmount", "discountPercentage"].includes(id)) {
        matchQuery[id] = Number(value);
      } else if (id === "validity") {
        matchQuery[id] = new Date(value);
      } else {
        matchQuery[id] = { $regex: value, $options: "i" };
      }
    });

    /* -----------------------------------------
       Sorting
    ----------------------------------------- */
   const sortQuery: Record<string, 1 | -1> = {};

sorting.forEach((sort) => {
  sortQuery[sort.id] = (sort.desc ? -1 : 1) as 1 | -1;
});

    /* -----------------------------------------
       MongoDB Aggregation Pipeline
    ----------------------------------------- */
    const pipeline = [
      { $match: matchQuery },
      { 
  $sort: Object.keys(sortQuery).length 
    ? sortQuery 
    : ({ createdAt: -1 } as Record<string, 1 | -1>)
},

      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          code: 1,
          discountPercentage: 1,
          minShoppingAmount: 1,
          validity: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    /* -----------------------------------------
       Execute Query
    ----------------------------------------- */
    const data = await CouponModel.aggregate(pipeline);
    const totalRowCount = await CouponModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
