/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product";
import ProductVariantModel from "@/models/Productvariant";
import MediaModel from "@/models/Media";
import CategoryModel from "@/models/Category";
import ProductAddonModel from "@/models/ProductAddon";
import mongoose, { Types } from "mongoose";
import axios from "axios";
import cloudinary from "@/lib/cloudinary";
import sharp from "sharp";
import { CloudinaryUploadResult } from "@/lib/types";

/* ---------------------------------------------
   HELPERS
--------------------------------------------- */
const normalizeAddonKey = (key: string) => {
  if (!key) return null;

  const map: Record<string, string> = {
    fall: "FALL_PICO",
    shapewear: "SHAPEWEAR",
    blouse_stitching: "BLOUSE_STITCHING",
    pre_stitched: "PRE_STITCHED",
  };

  return map[key.toLowerCase()] || null;
};


const convertDriveUrl = (url: string) => {
  const match = url.match(/\/d\/(.*?)\//);
  if (!match) return null;
  return `https://drive.google.com/uc?export=download&id=${match[1]}`;
};

const uploadImageFromUrl = async (
  url: string
): Promise<CloudinaryUploadResult | null> => {
  try {
    const directUrl = convertDriveUrl(url);
    if (!directUrl) return null;

    const response = await axios.get(directUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    const compressed = await sharp(buffer)
      .resize(1600)
      .jpeg({ quality: 85 })
      .toBuffer();

    return await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "products" }, (err, result) => {
          if (err) return reject(err);
          resolve(result as CloudinaryUploadResult);
        })
        .end(compressed);
    });
  } catch (err) {
    console.log("Image upload error:", url, err);
    return null;
  }
};

const uploadMultipleImages = async (urls: string[]) => {
  const ids: Types.ObjectId[] = [];

  for (const url of urls) {
    if (!url) continue;

    const uploaded = await uploadImageFromUrl(url);
    if (!uploaded) continue;

    const media = await MediaModel.create({
      public_id: uploaded.public_id,
      secure_url: uploaded.secure_url,
      asset_id: uploaded.asset_id,
      path: uploaded.public_id,
      thumbnail_url: uploaded.secure_url,
    });

    ids.push(media._id as Types.ObjectId);
  }

  return ids;
};

const getImageKey = (obj: any) =>
  obj["imageUrls(comma-separated)"] ||
  obj["imageUrls (comma-separated)"] ||
  "";

/* ---------------------------------------------
   MAIN IMPORT API
--------------------------------------------- */

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { products, variants, productAddons } = await req.json();

    if (!Array.isArray(products) || !Array.isArray(variants) || !Array.isArray(productAddons)) {
      throw new Error(
        "Invalid Payload! Required => { products: [], variants: [], productAddons: [] }"
      );
    }

    /* -----------------------------------------
         STEP 1: Upload Images (Outside Transaction)
    ----------------------------------------- */
    for (const p of products) {
      const img = getImageKey(p);
      p._mediaIds = img ? await uploadMultipleImages(img.split(",").map((s: string) => s.trim())) : [];
    }

    for (const v of variants) {
      const img = getImageKey(v);
      v._mediaIds = img ? await uploadMultipleImages(img.split(",").map((s: string) => s.trim())) : [];
    }

    /* -----------------------------------------
         STEP 2: DB Transaction for Inserts
    ----------------------------------------- */

    const session = await mongoose.startSession();
    session.startTransaction();

    const createdProducts: any[] = [];

    try {
      for (const p of products) {
        const category = await CategoryModel.findOne({ slug: p.categorySlug?.trim() });
        if (!category) throw new Error(`Category not found: ${p.categorySlug}`);

        // Create Product
        const [newProduct] = await ProductModel.create(
          [
            {
              name: p.name,
              slug: p.slug,
              category: category._id,
              mrp: Number(p.mrp),
              sellingPrice: Number(p.sellingPrice),
              discountPercentage: Number(p.discountPercentage),
              description: p.description,
              media: p._mediaIds,
              brand: p.brand || "",
              fabric: p.fabric || "",
              occasion: p.occasion || "",
            },
          ],
          { session }
        );

        const createdProductId = newProduct._id;

        /* -----------------------------------------
             INSERT VARIANTS FOR THIS PRODUCT
        ----------------------------------------- */
        const productVariants = variants
          .filter((v) => v.productSlug?.trim() === p.slug?.trim())
          .map((v) => ({
            product: createdProductId,
            color: v.color,
            size: v.size,
            mrp: Number(v.mrp),
            sellingPrice: Number(v.sellingPrice),
            discountPercentage: Number(v.discountPercentage),
            sku: v.sku,
            media: v._mediaIds.length ? v._mediaIds : p._mediaIds,
          }));

        if (productVariants.length) {
          await ProductVariantModel.insertMany(productVariants, { session });
        }

        /* -----------------------------------------
             INSERT PRODUCT ADDONS
        ----------------------------------------- */
        /* -----------------------------------------
   INSERT PRODUCT ADDONS (✅ EXCEL SAFE)
----------------------------------------- */
const addonsForProduct = productAddons.filter(
  (a) =>
    a.productSlug?.trim() === p.slug?.trim() &&
    String(a.active).toUpperCase() === "TRUE"
);

// GROUP BY addonKey
const groupedAddons = Object.values(
  addonsForProduct.reduce((acc: any, row: any) => {
    const normalizedKey = normalizeAddonKey(row.addonKey);
    if (!normalizedKey) return acc;

    if (!acc[normalizedKey]) {
      acc[normalizedKey] = {
        product: createdProductId,
        key: normalizedKey,
        label: row.addonLabel,
        type:
          row.optionLabel === "NO" || row.optionLabel === "YES"
            ? "radio"
            : "select",
        basePrice: 0,
        required: String(row.required).toUpperCase() === "TRUE",
        sortOrder: Number(row.sortOrder) || 0,
        options: [],
      };
    }

    // ADD OPTION ROW
    if (row.optionLabel && row.optionLabel !== "NO") {
      acc[normalizedKey].options.push({
        value: row.optionValue,
        label: row.optionLabel,
        price: Number(row.optionPrice) || 0,
      });
    }

    return acc;
  }, {})
);

if (groupedAddons.length > 0) {
  await ProductAddonModel.insertMany(groupedAddons, { session });
}


        createdProducts.push(newProduct);
      }

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

    return NextResponse.json({
      success: true,
      message: "Products, Variants & Addons Imported Successfully",
      createdProducts,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Import Failed",
      },
      { status: 500 }
    );
  }
}
