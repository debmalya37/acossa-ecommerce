import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PageSEOModel from "@/models/pageSEO";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  await dbConnect();
  const { path } = await params;

  const realPath = path === "home" ? "/" : `/${path}`;

  const seo = await PageSEOModel.findOne({ path: realPath });

  return NextResponse.json({ seo });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  await dbConnect();
  const { path } = await params;
  const realPath = path === "home" ? "/" : `/${path}`;

  const body = await req.json();

  const seo = await PageSEOModel.findOneAndUpdate(
    { path: realPath },
    body,
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, seo });
}
