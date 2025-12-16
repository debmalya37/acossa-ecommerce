// /api/admin/pages-seo/health/route.ts
import { NextResponse } from "next/server";
import PageSEOModel from "@/models/pageSEO";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  await dbConnect();
  const pages = await PageSEOModel.find();

  const data = pages.map(p => {
    let status = "good";
    if (!p.title || !p.description) status = "error";
    else if (p.title.length < 30 || p.description.length < 70)
      status = "warning";

    return { path: p.path, status };
  });

  return NextResponse.json({ pages: data });
}
