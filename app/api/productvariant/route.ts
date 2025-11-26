import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError } from "@/lib/helper";
import ProductVariantModel from "@/models/Productvariant";
import type { PipelineStage } from "mongoose";


/* -----------------------------------------
   Types
----------------------------------------- */
interface ColumnFilter {
  id: string;
  value: string;
}

interface ColumnSort {
  id: string;
  desc: boolean;
}

/* -----------------------------------------
   GET: Fetch Product Variants
----------------------------------------- */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const params = request.nextUrl.searchParams;

    const start = Number(params.get("start") || 0);
    const size = Number(params.get("size") || 10);

    let filters: ColumnFilter[] = [];
    let sorting: ColumnSort[] = [];

    try {
      filters = JSON.parse(params.get("filters") || "[]");
      sorting = JSON.parse(params.get("sorting") || "[]");
    } catch {
      filters = [];
      sorting = [];
    }

    const globalFilter = params.get("globalFilter") || "";
    const deleteType = params.get("deleteType") as "SD" | "PD" | null;

    /* -----------------------------------------
       Build Match Query
    ----------------------------------------- */
    const matchQuery: Record<string, any> = {};

    if (deleteType === "SD") {
      matchQuery.deletedAt = null;
    } else if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    if (globalFilter) {
      matchQuery.$or = [
        { color: { $regex: globalFilter, $options: "i" } },
        { size: { $regex: globalFilter, $options: "i" } },
        { sku: { $regex: globalFilter, $options: "i" } },
        { "productData.name": { $regex: globalFilter, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$mrp" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$sellingPrice" },
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

    // Column-specific filters
    filters.forEach((filter) => {
      if (["mrp", "sellingPrice", "discountPercentage"].includes(filter.id)) {
        matchQuery[filter.id] = Number(filter.value);
      } else if (filter.id === "product") {
        matchQuery["productData.name"] = {
          $regex: filter.value,
          $options: "i",
        };
      } else {
        matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
      }
    });

    /* -----------------------------------------
       Sorting
    ----------------------------------------- */
    const sortQuery: Record<string, 1 | -1> = {};

    sorting.forEach((s) => {
      sortQuery[s.id] = s.desc ? -1 : 1;
    });

    /* -----------------------------------------
       Aggregation Pipeline
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
      {
        $unwind: {
          path: "$productData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: matchQuery,
      },
      {
        $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 },
      },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          product: "$productData.name",
          color: 1,
          size: 1,
          sku: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    /* -----------------------------------------
       Execute Query
    ----------------------------------------- */
    const result = await ProductVariantModel.aggregate(pipeline);

    const totalRowCount = await ProductVariantModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: result,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
