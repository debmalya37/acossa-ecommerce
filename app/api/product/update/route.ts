import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import zodSchema from "@/lib/zodSchema";
import ProductModel from "@/models/Product";

/* ---------------------------------------------------
   Zod Validation Schema (Type-safe)
---------------------------------------------------- */
const updateProductSchema = zodSchema.pick({
  _id: true,
  name: true,
  slug: true,
  category: true,
  mrp: true,
  sellingPrice: true,
  discountPercentage: true,
  description: true,
  media: true,
});

export async function PUT(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();

    // Parse incoming JSON
    const payload = await request.json();

    // Validate using Zod
    const parsed = updateProductSchema.safeParse(payload);

    if (!parsed.success) {
      return response(false, 400, "Invalid or missing fields.", parsed.error);
    }

    const {
      _id,
      name,
      slug,
      category,
      mrp,
      sellingPrice,
      discountPercentage,
      description,
      media,
    } = parsed.data;

    /* ---------------------------------------------------
       Check product existence
    ---------------------------------------------------- */
    const existingProduct = await ProductModel.findOne({
      _id,
      deletedAt: null,
    });

    if (!existingProduct) {
      return response(false, 404, "Product not found.");
    }

    /* ---------------------------------------------------
       Perform atomic update (Cleaner, faster, safer)
    ---------------------------------------------------- */
    await ProductModel.updateOne(
      { _id },
      {
        $set: {
          name,
          slug,
          category,
          mrp,
          sellingPrice,
          discountPercentage,
          description,
          media,
        },
      }
    );

    return response(true, 200, "Product updated successfully.");
  } catch (error) {
    return catchError(error);
  }
}
