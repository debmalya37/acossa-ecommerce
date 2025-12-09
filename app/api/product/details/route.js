/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helper";
import ProductModel from "@/models/Product";
import { isValidObjectId } from "mongoose";
import { de } from "zod/v4/locales";
import ProductVariantModel from "@/models/Productvariant";
import ReviewModel from "@/models/Review";

/* -----------------------------------------------------
   Types for Dynamic Route Params
------------------------------------------------------ */
// interface RouteParams {
//   params: {
//     id: string;
//     slug: string;
//   };
// }

/* -----------------------------------------------------
   GET Handler - Type Safe & Optimized
------------------------------------------------------ */
export async function GET(request, params) {
  try {
    await dbConnect();

    const getParams = await params
    const slug = getParams.slug;
     const searchParams = request.nextUrl.searchParams;
    const color = searchParams.get('color');
    const size = searchParams.get('size');


    const filter = {
        deletedAt: null,
        slug: ""
    }
    if(!slug) {
        return response(false, 400, "Product not found");
    }

    filter.slug = slug;
    const getProduct = await ProductModel.findOne(filter)
    .populate("media", "secure_url")
    .lean();

    if(!getProduct) {
        return response(false, 404, "Product not found");
    }
    // get product variant 
    const variantFilter = {
        product: getProduct._id,
        deletedAt: null
    }

    if(size) {
        variantFilter.size = size;
    }

    if(color) {
        variantFilter.color = color;
    }

    const variant = await ProductVariantModel.findOne(variantFilter).populate("media", "secure_url").lean();

    if(!variant) {
        return response(false, 404, "Product variant not found");
    }
    // get color and size options
    const getColor = await ProductVariantModel.distinct('color', {
        product: getProduct._id,
        deletedAt: null
    })

    const getSize = await ProductVariantModel.aggregate([
        {$match: {product: getProduct._id, deletedAt: null}},
        { $sort: {_id: 1} },
        {
            $group: {
                _id: "$size",
                first: { $first: "$_id" }
            }
        },
        { $sort: {first: 1} },
        { $project: { _id: 0, size: "$_id" }},
    ])

// get review
const review = await ReviewModel.countDocuments({product: getProduct._id, deletedAt: null});

const productData = {
    products: getProduct,
    variant: variant,
    colors: getColor,
    sizes: getSize.length ? getSize.map(item => item.size) : [],
    reviewCount: review
}

return response(true, 200, "Product found", productData);

  } catch (error) {
    return catchError(error);
  }
}
