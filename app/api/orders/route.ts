import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { catchError } from "@/lib/helper";
import orderModel from "@/models/Order";


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
        { order_id: { $regex: globalFilter, $options: "i" } },
        { payment_id: { $regex: globalFilter, $options: "i" } },
        { name: { $regex: globalFilter, $options: "i" } },
        { email: { $regex: globalFilter, $options: "i" } },
        { phone: { $regex: globalFilter, $options: "i" } },
        { country: { $regex: globalFilter, $options: "i" } },
        { state: { $regex: globalFilter, $options: "i" } },
        { city: { $regex: globalFilter, $options: "i" } },
        { pincode: { $regex: globalFilter, $options: "i" } },
        { discount: { $regex: globalFilter, $options: "i" } },
        { couponDiscount: { $regex: globalFilter, $options: "i" } },
        { totalAmount: { $regex: globalFilter, $options: "i" } },
        { status: { $regex: globalFilter, $options: "i" } },

       
      ];
    }

    /* -----------------------------------------
       Column-specific filters
    ----------------------------------------- */
    filters.forEach((filter) => {
      const { id, value } = filter;
    matchQuery[id] = { $regex: value, $options: "i" };
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
      
    ];

    /* -----------------------------------------
       Execute Query
    ----------------------------------------- */
    const getOrders = await orderModel.aggregate(pipeline);
    const totalRowCount = await orderModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getOrders,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
