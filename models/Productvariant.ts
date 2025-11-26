import mongoose, { Schema, Document, Types, Model } from "mongoose";

// ======================================
// 1. TypeScript Interface
// ======================================

export interface IProductVariant extends Document {
  product: Types.ObjectId;
  color: string;
  size: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  sku: string;
  media: Types.ObjectId[];
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Add this below IProductVariant interface:

// When .populate("product") is used:
export interface PopulatedProduct {
  _id: string;
  name: string;
  slug: string;
}

// When .populate("media") is used:
export interface PopulatedMedia {
  secure_url: string;
}

// When both product and media are populated:
export interface IProductVariantPopulated extends Omit<IProductVariant, "product" | "media"> {
  product: PopulatedProduct;
  media: PopulatedMedia[];
}

// ======================================
// 2. Product Variant Schema
// ======================================

const productVariantSchema = new Schema<IProductVariant>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true, // faster joins
    },

    color: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
    },

    size: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 10, // S, M, L, XL, etc.
    },

    mrp: {
      type: Number,
      required: true,
      min: 1,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 1,
    },

    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: 100,
      index: true, // faster SKU lookups
    },

    media: [
      {
        type: Schema.Types.ObjectId,
        ref: "Media",
        required: true,
      },
    ],

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ======================================
// 3. Production Indexes
// ======================================

// Fast lookups by product → list all variants
productVariantSchema.index({ product: 1 });

// SKU already has unique index
productVariantSchema.index({ sku: 1 });

// Optional: Auto-delete soft-deleted variants
productVariantSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 0 });

// ======================================
// 4. Safe Model Export (Next.js Hot Reload Safe)
// ======================================

export const ProductVariantModel: Model<IProductVariant> =
  mongoose.models.ProductVariant ||
  mongoose.model<IProductVariant>(
    "ProductVariant",
    productVariantSchema,
    "productvariants"
  );

export default ProductVariantModel;
