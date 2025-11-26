import mongoose, { Schema, Document, Types, Model } from "mongoose";

// ======================================
// 1. TypeScript Interface
// ======================================

export interface IMedia extends Document {
  asset_id?: string;
  public_id: string;
  secure_url: string; 
  path: string;
  thumbnail_url: string;
  alt?: string;
  title?: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ======================================
// 2. Schema Definition
// ======================================

const mediaSchema = new Schema<IMedia>(
  {
    asset_id: {
      type: String,
      required: false,  // ← FIXED
      trim: true,
      maxlength: 200,
    },

    public_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 200,
      index: true, // faster deletions & lookups
    },
 secure_url: {                      // <<< ADD THIS
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    path: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    thumbnail_url: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    alt: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    title: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
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
// 3. Indexes (Performance Optimized)
// ======================================

// Index for all active media (common in dashboard filtering)
mediaSchema.index({ deletedAt: 1 });

// Optional TTL: auto-delete once deletedAt is set
mediaSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 0 });

// Search optimizations:
mediaSchema.index({ title: "text", alt: "text" });

// ======================================
// 4. Model Export (Next.js Hot Reload Safe)
// ======================================

export const MediaModel: Model<IMedia> =
  mongoose.models.Media ||
  mongoose.model<IMedia>("Media", mediaSchema, "media");

export default MediaModel;
