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


export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const deleted = await Blog.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error:any) {
    return NextResponse.json(
      { success: false, message: "Failed to delete blog " + error.message },
      { status: 500 }
    );
  }
}