import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await dbConnect();

  // ✅ REQUIRED IN NEXT.JS 15
  const { slug } = await params;

  const blog = await Blog.findOne({
    slug,
    published: true,
  });

  if (!blog) {
    return NextResponse.json(
      { message: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ blog });
}
