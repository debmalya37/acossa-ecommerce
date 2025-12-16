import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  media: Types.ObjectId[];
  description: string;
  brand?: string;
  fabric?: string;
  occasion?: string;
  
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
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
    media: [
      {
        type: Schema.Types.ObjectId,
        ref: "Media",
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    
    brand: { type: String, trim: true, default: "" },
    fabric: { type: String, trim: true, default: "" },
    occasion: { type: String, trim: true, default: "" },
    seo: {
  title: {
    type: String,
    trim: true,
    maxlength: 70, // Google safe
  },
  description: {
    type: String,
    trim: true,
    maxlength: 160,
  },
  keywords: [
    {
      type: String,
      trim: true,
    },
  ],
},

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


// Fast category-based listing
productSchema.index({ category: 1 });

// Optional TTL deletion (if required)
productSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 0 });

// ======================================
// 4. Model Export (Next.js Safe)
// ======================================

export const ProductModel: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", productSchema, "products");

export default ProductModel;
