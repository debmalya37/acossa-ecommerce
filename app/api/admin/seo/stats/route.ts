import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PageSEOModel from "@/models/pageSEO";
import ProductModel from "@/models/Product";

function score(title?: string, desc?: string) {
  if (!title || !desc) return 0;
  let s = 0;
  if (title.length >= 30 && title.length <= 60) s += 50;
  if (desc.length >= 70 && desc.length <= 160) s += 50;
  return s;
}

export async function GET() {
  await dbConnect();

  const pages = await PageSEOModel.find();
  const products = await ProductModel.find().select("name seo");

  let pageScore = 0;
  let productScore = 0;

  pages.forEach(p => {
    pageScore += score(p.title, p.description);
  });

  products.forEach(p => {
    productScore += score(p.seo?.title, p.seo?.description);
  });

  return NextResponse.json({
    pages: {
      total: pages.length,
      missing: pages.filter(p => !p.title || !p.description).length,
      avgScore: pages.length ? Math.round(pageScore / pages.length) : 0,
    },
    products: {
      total: products.length,
      missing: products.filter(p => !p.seo?.title || !p.seo?.description).length,
      avgScore: products.length ? Math.round(productScore / products.length) : 0,
    },
  });
}
