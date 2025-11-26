import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError } from "@/lib/helper";
import MediaModel from "@/models/Media";

interface MediaQueryParams {
  page: number;
  limit: number;
  deleteType?: "SD" | "PD" | null;
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();

    const params = request.nextUrl.searchParams;

    const query: MediaQueryParams = {
      page: Number(params.get("page") || 0),
      limit: Number(params.get("limit") || 10),
      deleteType: (params.get("deleteType") as "SD" | "PD" | null) || null,
    };

    /* --------------------------
       Build filter conditions
    --------------------------- */
    const filter: Record<string, unknown> = {};

    if (query.deleteType === "SD") {
      filter.deletedAt = null;
    } else if (query.deleteType === "PD") {
      filter.deletedAt = { $ne: null };
    }

    /* --------------------------
       Fetch Data
    --------------------------- */
    const mediaData = await MediaModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(query.page * query.limit)
      .limit(query.limit)
      .lean();

    const totalMediaCount = await MediaModel.countDocuments(filter);

    const hasMore = (query.page + 1) * query.limit < totalMediaCount;

    /* --------------------------
       Return updated structure
    --------------------------- */
    return NextResponse.json({
      success: true,
      mediaData, // ✔ FRONTEND NOW GETS mediaData
      hasMore,
      meta: {
        totalRecords: totalMediaCount,
        page: query.page,
        limit: query.limit,
      },
    });
  } catch (error) {
    return catchError(error);
  }
}
