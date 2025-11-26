/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product";
import ProductVariantModel from "@/models/Productvariant";
import MediaModel from "@/models/Media";
import CategoryModel from "@/models/Category";
import mongoose, { Types } from "mongoose";
import axios from "axios";
import cloudinary from "@/lib/cloudinary";
import sharp from "sharp";
import { CloudinaryUploadResult } from "@/lib/types";

/* ---------------------------------------------
   HELPERS
--------------------------------------------- */

// Convert Google Drive links → direct download URL
const convertDriveUrl = (url: string) => {
  const match = url.match(/\/d\/(.*?)\//);
  if (!match) return null;
  return `https://drive.google.com/uc?export=download&id=${match[1]}`;
};

// Upload one image from Google Drive → Cloudinary
const uploadImageFromUrl = async (url: string): Promise<CloudinaryUploadResult | null> => {
  try {
    const directUrl = convertDriveUrl(url);
    if (!directUrl) return null;

    const response = await axios.get(directUrl, { responseType: "arraybuffer" });
    const originalBuffer = Buffer.from(response.data);

    const compressed = await sharp(originalBuffer)
      .resize(1600, null, { fit: "inside" })
      .jpeg({ quality: 85 })
      .toBuffer();

    return await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "products" },
        (err, result) => {
          if (err) return reject(err);
          resolve(result as CloudinaryUploadResult);  // ⭐ FIXED
        }
      ).end(compressed);
    });
  } catch (error) {
    console.log("Upload failed:", url, error);
    return null;
  }
};


// Upload multiple URLs → Cloudinary + Save to MediaModel (NO TRANSACTION)
const uploadMultipleImages = async (urls: string[]) => {
  const mediaIds: Types.ObjectId[] = [];

  for (const url of urls) {
    const uploaded = await uploadImageFromUrl(url);
    if (!uploaded) continue;

    const media = await MediaModel.create({
  public_id: uploaded.public_id,
  secure_url: uploaded.secure_url,
  asset_id: uploaded.asset_id,
  path: uploaded.public_id,
  thumbnail_url: uploaded.secure_url,
});


    mediaIds.push(media._id as Types.ObjectId); // ✅ FIX

  }

  return mediaIds;
};

const getImageKey = (obj: any) =>
  obj["imageUrls(comma-separated)"] ||
  obj["imageUrls (comma-separated)"] ||
  "";

/* ---------------------------------------------
   MAIN IMPORT API (optimized)
--------------------------------------------- */

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { products, variants } = await req.json();

    if (!Array.isArray(products) || !Array.isArray(variants)) {
      throw new Error("Invalid payload! Must include products[] and variants[]");
    }

    /* ---------------------------------------------------------
       STEP 1: UPLOAD ALL MEDIA OUTSIDE TRANSACTION
    --------------------------------------------------------- */

    // Attach pre-uploaded media arrays to product objects
    for (const p of products) {
      const productImageField = getImageKey(p);
      p._mediaIds = [];

      if (productImageField) {
        const urls = productImageField.split(",").map((s: string) => s.trim());
        p._mediaIds = await uploadMultipleImages(urls);
      }
    }

    // Attach variant media
    for (const v of variants) {
      const variantImageField = getImageKey(v);
      v._mediaIds = [];

      if (variantImageField) {
        const urls = variantImageField.split(",").map((s: string) => s.trim());
        v._mediaIds = await uploadMultipleImages(urls);
      }
    }

    /* ---------------------------------------------------------
       STEP 2: START TRANSACTION FOR DB INSERTS ONLY
    --------------------------------------------------------- */

    const session = await mongoose.startSession();
    session.startTransaction();
    const createdProducts: any[] = [];

    try {
      for (const p of products) {
        // Validate category
        const category = await CategoryModel.findOne({
          slug: p.categorySlug?.trim(),
        });

        if (!category) throw new Error(`Category not found: ${p.categorySlug}`);

        // Create Product
        const [createdProduct] = await ProductModel.create(
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

        const productDoc = createdProduct;

        // Handle variants
        const productVariants = variants
          .filter((v) => v.productSlug?.trim() === p.slug?.trim())
          .map((v) => ({
            product: productDoc._id,
            color: v.color,
            size: v.size,
            mrp: Number(v.mrp),
            sellingPrice: Number(v.sellingPrice),
            discountPercentage: Number(v.discountPercentage),
            sku: v.sku,
            media: v._mediaIds.length > 0 ? v._mediaIds : p._mediaIds,
          }));

        if (productVariants.length > 0) {
          await ProductVariantModel.insertMany(productVariants, { session });
        }

        createdProducts.push(productDoc);
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
      message: "Products imported successfully",
      createdProducts,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
