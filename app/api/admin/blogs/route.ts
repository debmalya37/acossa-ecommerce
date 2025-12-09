import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const blog = await Blog.create(body);
  return NextResponse.json({ success: true, blog });
}

export async function GET() {
  await dbConnect();
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return NextResponse.json({ blogs });
}
