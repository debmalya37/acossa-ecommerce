import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import zodSchema from "@/lib/zodSchema";
import ProductVariantModel from "@/models/Productvariant";
import { Types } from "mongoose";

/* -----------------------------------------
   PUT → Update Product Variant
----------------------------------------- */
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const payload = await request.json();

    // --- Zod validation ---
    const schema = zodSchema.pick({
      _id: true,
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

    const {
      _id,
      product,
      sku,
      color,
      size,
      mrp,
      sellingPrice,
      discountPercentage,
      media,
    } = parsed.data;

    // Fetch existing variant (only active)
    const variant = await ProductVariantModel.findOne({ _id, deletedAt: null });

    if (!variant) {
      return response(false, 404, "Product variant not found.");
    }

    // ---- Convert fields to ObjectId types ----
    const productObjectId = new Types.ObjectId(product);

    const mediaObjectIds = (media as string[]).map(
      (m) => new Types.ObjectId(m)
    );

    // Update fields
    variant.product = productObjectId;
    variant.sku = sku;
    variant.color = color;
    variant.size = size;
    variant.mrp = mrp;
    variant.sellingPrice = sellingPrice;
    variant.discountPercentage = discountPercentage;
    variant.media = mediaObjectIds;

    await variant.save();

    return response(true, 200, "Product variant updated successfully.");
  } catch (error) {
    return catchError(error);
  }
}
