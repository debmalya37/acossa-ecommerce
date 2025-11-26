import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helper";
import zodSchema from "@/lib/zodSchema";
import ProductModel from "@/models/Product";
import z from "zod";

/* -------------------------------------------------
   Zod Schema Extract (Typed)
-------------------------------------------------- */
const createProductSchema = zodSchema.pick({
  name: true,
  slug: true,
  category: true,
  mrp: true,
  sellingPrice: true,
  discountPercentage: true,
  description: true,
  media: true,
});

type CreateProductPayload = z.infer<typeof createProductSchema>;


/* -------------------------------------------------
   POST → Create New Product
-------------------------------------------------- */
export async function POST(request: NextRequest) {
  try {
    // 🔐 Authentication
    // const auth = await isAuthenticated("admin");
    // if (!auth.isAuth) {
    //   return response(false, 403, "Unauthorized");
    // }

    await dbConnect();

    // 📌 Parse body
    const payload: CreateProductPayload = await request.json();

    // 🧪 Validate using Zod
    const validation = createProductSchema.safeParse(payload);
    if (!validation.success) {
      return response(false, 400, "Invalid or missing fields.", validation.error);
    }

    const {
      name,
      slug,
      category,
      mrp,
      sellingPrice,
      discountPercentage,
      description,
      media,
    } = validation.data;

    // 🆕 Create product
    await ProductModel.create({
      name,
      slug,
      category,
      mrp,
      sellingPrice,
      discountPercentage,
      description,
      media,
    });

    return response(true, 200, "Product added successfully.");
  } catch (error) {
    return catchError(error);
  }
}
