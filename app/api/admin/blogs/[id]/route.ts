import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  // ✅ REQUIRED IN NEXT.JS 15
  const { id } = await params;

  const blog = await Blog.findById(id);
  if (!blog) {
    return NextResponse.json(
      { message: "Blog not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ blog });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  // ✅ REQUIRED IN NEXT.JS 15
  const { id } = await params;
  const body = await req.json();

  const blog = await Blog.findByIdAndUpdate(
    id,
    {
      ...body,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!blog) {
    return NextResponse.json(
      { message: "Blog not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ blog });
}
