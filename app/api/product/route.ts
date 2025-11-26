import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError } from "@/lib/helper";
import ProductModel from "@/models/Product";
import { PipelineStage } from "mongoose";   // ✅ IMPORTANT

interface MRTFilter {
  id: string;
  value: string;
}

interface MRTSorting {
  id: string;
  desc: boolean;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;

    const start = Number(searchParams.get("start") || 0);
    const size = Number(searchParams.get("size") || 10);

    const filters: MRTFilter[] = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";

    const sorting: MRTSorting[] = JSON.parse(
      searchParams.get("sorting") || "[]"
    );

    const deleteType = searchParams.get("deleteType");

    const matchQuery: Record<string, unknown> = {};

    if (deleteType === "SD") {
      matchQuery.deletedAt = null;
    } else if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    if (globalFilter) {
      matchQuery.$or = [
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
        { "categoryData.name": { $regex: globalFilter, $options: "i" } },
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

    filters.forEach((filter) => {
      if (
        filter.id === "mrp" ||
        filter.id === "sellingPrice" ||
        filter.id === "discountPercentage"
      ) {
        matchQuery[filter.id] = Number(filter.value);
      } else {
        matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
      }
    });

    const sortQuery: Record<string, 1 | -1> = {};

    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    /* ---------------------------------------------
         🚀 FIX → CAST Pipeline as PipelineStage[]
    ---------------------------------------------- */
    const aggregatePipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: matchQuery },
      {
        $sort:
          Object.keys(sortQuery).length > 0
            ? sortQuery
            : { createdAt: -1 },
      },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          category: "$categoryData.name",
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    const products = await ProductModel.aggregate(aggregatePipeline);

    const totalRowCount = await ProductModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: products,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
