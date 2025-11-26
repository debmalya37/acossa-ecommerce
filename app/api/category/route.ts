import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError } from "@/lib/helper";
import CategoryModel from "@/models/Category";
import type { PipelineStage } from "mongoose";

/* ------------------------------------------------------------------
   Types for filters, sorting, etc.
-------------------------------------------------------------------*/
interface MRTFilter {
  id: string;
  value: string;
}

interface MRTSorting {
  id: string;
  desc: boolean;
}

/* ------------------------------------------------------------------
   Safe JSON Parse Helper
-------------------------------------------------------------------*/
function safeJson<T>(value: string | null, fallback: T): T {
  try {
    if (!value || value.trim() === "") return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------
   GET Handler (Typed & Optimized)
-------------------------------------------------------------------*/
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const params = request.nextUrl.searchParams;

    // Pagination
    const start = Number(params.get("start") || 0);
    const size = Number(params.get("size") || 10);

    // Table Filters
    const filters = safeJson<MRTFilter[]>(params.get("filters"), []);
    const sorting = safeJson<MRTSorting[]>(params.get("sorting"), []);

    const globalFilter = params.get("globalFilter") || "";
    const deleteType = params.get("deleteType");

    /* ------------------------------------------------------------------
       Build Match Query
    -------------------------------------------------------------------*/
    const matchQuery: Record<string, unknown> = {};

    if (deleteType === "SD") {
      matchQuery.deletedAt = null;
    } else if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    // Global Search
    if (globalFilter) {
      matchQuery.$or = [
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
      ];
    }

    // Column Filters
    filters.forEach((f) => {
      matchQuery[f.id] = { $regex: f.value, $options: "i" };
    });

    /* ------------------------------------------------------------------
       Sorting
    -------------------------------------------------------------------*/
    const sortQuery: Record<string, 1 | -1> = {};

    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    /* ------------------------------------------------------------------
       Aggregate Pipeline (Typed)
    -------------------------------------------------------------------*/
    const pipeline: PipelineStage[] = [
  { $match: matchQuery },
  { 
    $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } 
  },
  { $skip: start },
  { $limit: size },
  {
    $project: {
      _id: 1,
      name: 1,
      slug: 1,
      createdAt: 1,
      updatedAt: 1,
      deletedAt: 1,
    },
  },
];


    const categories = await CategoryModel.aggregate(pipeline);
    const totalRowCount = await CategoryModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: categories,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
