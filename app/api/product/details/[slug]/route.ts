/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";

import ProductModel from "@/models/Product";
import ProductVariantModel from "@/models/Productvariant";
import ProductAddonModel from "@/models/ProductAddon";
import ReviewModel from "@/models/Review";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await context.params;

    if (!slug) {
      return response(false, 400, "Product slug is missing");
    }

    const searchParams = request.nextUrl.searchParams;
    const color = searchParams.get("color");
    const size = searchParams.get("size");

    // -------------------------------------------------------------
    // 1) PRODUCT
    // -------------------------------------------------------------
    const product = await ProductModel.findOne({
      slug,
      deletedAt: null,
    })
      .populate("media", "secure_url")
      .lean();

    if (!product) {
      return response(false, 404, "Product not found");
    }

    // -------------------------------------------------------------
    // 2) VARIANT
    // -------------------------------------------------------------
    const variantFilter: any = {
      product: product._id,
      deletedAt: null,
    };

    if (size) variantFilter.size = size;
    if (color) variantFilter.color = color;

    const variant = await ProductVariantModel.findOne(variantFilter)
      .populate("media", "secure_url")
      .lean();

    if (!variant) {
      return response(false, 404, "Product variant not found");
    }

    // -------------------------------------------------------------
    // 3) COLORS
    // -------------------------------------------------------------
    const colors = await ProductVariantModel.distinct("color", {
      product: product._id,
      deletedAt: null,
    });

    // -------------------------------------------------------------
    // 4) SIZES
    // -------------------------------------------------------------
    const sizeAgg = await ProductVariantModel.aggregate([
      { $match: { product: product._id, deletedAt: null } },
      { $sort: { _id: 1 } },
      {
        $group: {
          _id: "$size",
          first: { $first: "$_id" },
        },
      },
      { $sort: { first: 1 } },
      { $project: { _id: 0, size: "$_id" } },
    ]);

    const sizes = sizeAgg.map((i) => i.size);

    // -------------------------------------------------------------
    // 5) PRODUCT ADDONS ✅ NEW
    // -------------------------------------------------------------
    const addons = await ProductAddonModel.find({
      product: product._id,
      deletedAt: null,
    })
      .sort({ sortOrder: 1 })
      .select(
        "key label type basePrice required options sortOrder"
      )
      .lean();

      console.log("Product ADDONS:", addons);
    // Example frontend-ready addon object:
    // {
    //   key: "BLOUSE_STITCHING",
    //   label: "Blouse Stitching",
    //   type: "select",
    //   basePrice: 499,
    //   required: false,
    //   options: [
    //     { value: "S_36", label: "S / 36", price: 0 },
    //     { value: "M_38", label: "M / 38", price: 50 }
    //   ]
    // }

    // -------------------------------------------------------------
    // 6) REVIEW COUNT
    // -------------------------------------------------------------
    const reviewCount = await ReviewModel.countDocuments({
      product: product._id,
      deletedAt: null,
    });

    // -------------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------------
    return response(true, 200, "Product found", {
      product,
      variant,
      colors,
      sizes,
      addons,       // ✅ ADDED
      reviewCount,
    });
  } catch (error) {
    return catchError(error);
  }
}
