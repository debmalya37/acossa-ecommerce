import mongoose, { Schema, Document, Model, Types } from "mongoose";

// =========================
// 1. TypeScript Interfaces
// =========================

export interface IReview extends Document {
  product: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  title: string;
  review: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// =========================
// 2. Mongoose Schema
// =========================

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    review: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// =========================
// 3. TTL Index (If Required)
// =========================
// If you want auto-delete after `deletedAt` is set, use TTL on deletedAt
reviewSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 0 });

// =========================
// 4. Export Model Safely
// =========================

export const ReviewModel: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema, "reviews");

export default ReviewModel;
