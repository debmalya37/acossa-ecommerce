import mongoose, { Schema, Document, Model } from "mongoose";

// ======================================
// 1. TypeScript Interface
// ======================================

export interface ICoupon extends Document {
  code: string;
  discountPercentage: number;
  minShoppingAmount: number;
  validity: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ======================================
// 2. Schema Definition (Production Optimized)
// ======================================

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
      maxlength: 50,
      index: true,
    },

    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    minShoppingAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    validity: {
      type: Date,
      default: null,
      index: true, // used for TTL if needed
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

// Code search index
couponSchema.index({ code: 1 });

// Optional TTL auto-delete after expiry
couponSchema.index({ validity: 1 }, { expireAfterSeconds: 0 });

// Optional TTL auto-delete on soft delete
couponSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 0 });

// ======================================
// 4. Safe Model Export (Next.js Hot Reload Safe)
// ======================================

export const CouponModel: Model<ICoupon> =
  mongoose.models.Coupon ||
  mongoose.model<ICoupon>("Coupon", couponSchema, "coupons");

export default CouponModel;
