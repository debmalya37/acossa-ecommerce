import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import zodSchema from "@/lib/zodSchema";
import ProductVariantModel from "@/models/Productvariant";
import { isValidObjectId } from "mongoose";

/* -----------------------------------------
   POST → Create Product Variant
----------------------------------------- */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Get payload
    const payload = await request.json();

    // Zod validation
    const schema = zodSchema.pick({
      product: true,
      sku: true,
      color: true,
      size: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      media: true,
    });

    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      return response(false, 400, "Invalid or missing fields.", parsed.error);
    }

    const { product, sku, color, size, mrp, sellingPrice, discountPercentage, media } =
      parsed.data;

    /* -----------------------------------------
       Validate ObjectId fields
    ----------------------------------------- */
    if (!isValidObjectId(product)) {
      return response(false, 400, "Invalid product ObjectId.");
    }

    if (!Array.isArray(media) || media.some((id) => !isValidObjectId(id))) {
      return response(false, 400, "Media must be an array of valid ObjectIds.");
    }

    /* -----------------------------------------
       Prevent duplicate SKU
    ----------------------------------------- */
    const existingSKU = await ProductVariantModel.findOne({ sku }).lean();
    if (existingSKU) {
      return response(false, 400, `SKU already exists: ${sku}`);
    }

    /* -----------------------------------------
       Create Variant
    ----------------------------------------- */
    const newVariant = await ProductVariantModel.create({
      product,
      sku,
      color,
      size,
      mrp,
      sellingPrice,
      discountPercentage,
      media,
    });

    return response(true, 200, "Product Variant created successfully.", newVariant);
  } catch (error) {
    return catchError(error);
  }
}
