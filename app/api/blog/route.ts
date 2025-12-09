import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") || 0);
  const page = Number(searchParams.get("page") || 1);

  const query = Blog.find({ published: true }).sort({ createdAt: -1 });

  if (limit > 0) {
    query.skip((page - 1) * limit).limit(limit);
  }

  const blogs = await query;

  return NextResponse.json({ blogs });
}
