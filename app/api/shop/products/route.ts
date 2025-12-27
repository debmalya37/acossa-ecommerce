/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product";
import ProductVariantModel from "@/models/Productvariant";
import CategoryModel from "@/models/Category";
import "@/models/Media";
import "@/models/Category";
import "@/models/Productvariant";
import "@/models/ProductAddon";
import "@/models/User";
import "@/models/Review";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const params = req.nextUrl.searchParams;

    const category = params.get("category");
    const size = params.get("size");
    const color = params.get("color");
    const brand = params.get("brand");
    // 👇 NEW: Get search query
    const search = params.get("search"); 

    const minPrice = Number(params.get("minPrice") || 0);
    const maxPrice = Number(params.get("maxPrice") || 999999999);

    const page = Number(params.get("page") || 1);
    const limit = Number(params.get("limit") || 20);
    const skip = (page - 1) * limit;

    /* ----------------------------------
       BASE PRODUCT FILTER (DB Level)
    ----------------------------------- */
    const productFilter: any = { deletedAt: null };

    if (category && category !== "all") productFilter.category = category;
    if (brand) productFilter.brand = { $regex: brand, $options: "i" };
    
    // 👇 NEW: Add Name Search Logic
    if (search) {
      productFilter.name = { $regex: search, $options: "i" };
    }

    /* ----------------------------------
       FETCH PRODUCTS
    ----------------------------------- */
    const products = await ProductModel.find(productFilter)
      .sort({ createdAt: -1 })
      .populate("media", "_id secure_url")
      .populate("category", "name slug")
      .lean();

    if (!products.length) {
      return NextResponse.json({
        success: true,
        data: [],
        filters: { categories: [], sizes: [], colors: [], brands: [], priceRange: { min: 0, max: 0 } },
        meta: { totalProducts: 0, totalPages: 0, page, limit },
      });
    }

    const productIds = products.map((p) => p._id);

    /* ----------------------------------
       FETCH VARIANTS (FOR FILTERING)
    ----------------------------------- */
    const variantQuery: any = {
      product: { $in: productIds },
      deletedAt: null,
    };

    if (size && size !== "all") variantQuery.size = size;
    if (color) variantQuery.color = color.toLowerCase();

    const variants = await ProductVariantModel.find(variantQuery).lean();

    /* ----------------------------------
       PRICE FILTER
    ----------------------------------- */
    const validVariants = variants.filter((v) => {
      return v.sellingPrice >= minPrice && v.sellingPrice <= maxPrice;
    });

    const validProductIds = new Set(validVariants.map((v) => v.product.toString()));

    /* ----------------------------------
       FINAL FILTERING (In Memory)
    ----------------------------------- */
    const allFilteredProducts = products.filter((p) => {
      const productId = p._id.toString();
      const hasVariants = variants.some((v) => v.product.toString() === productId);
      
      if (hasVariants) {
        return validProductIds.has(productId);
      }
      
      if (size || color) return false; 
      
      return true; 
    });

    /* ----------------------------------
       PAGINATION LOGIC
    ----------------------------------- */
    const totalProducts = allFilteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const paginatedProducts = allFilteredProducts.slice(skip, skip + limit);

    /* ----------------------------------
       BUILD FILTERS RESPONSE
    ----------------------------------- */
    const allSizes = [...new Set(variants.map((v) => v.size))];
    const allColors = [...new Set(variants.map((v) => v.color))];
    const allBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

    const allPrices = variants.map((v) => v.sellingPrice);
    const priceMin = allPrices.length ? Math.min(...allPrices) : 0;
    const priceMax = allPrices.length ? Math.max(...allPrices) : 0;

    const categories = await CategoryModel.find({ deletedAt: null }).select("name slug");

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      filters: {
        categories,
        sizes: allSizes,
        colors: allColors,
        brands: allBrands,
        priceRange: { min: priceMin, max: priceMax },
      },
      meta: {
        totalProducts,
        totalPages,
        page,
        limit,
      },
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
}