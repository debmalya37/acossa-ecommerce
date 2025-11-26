import mongoose, { Schema, Document, Model } from "mongoose";

// ======================================
// 1. TypeScript Interface
// ======================================

export interface ICategory extends Document {
  name: string;
  slug: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ======================================
// 2. Schema Definition (Optimized)
// ======================================

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true, // soft delete support
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

// Text index for searching categories by name (optional)
categorySchema.index({ name: "text" });

// Optional auto-delete on soft delete (TTL)
categorySchema.index({ deletedAt: 1 }, { expireAfterSeconds: 0 });

// ======================================
// 4. Model Export (Next.js Hot-Reload Safe)
// ======================================

export const CategoryModel: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema, "categories");

export default CategoryModel;
