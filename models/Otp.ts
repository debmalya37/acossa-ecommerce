import mongoose, { Schema, Document, Model } from "mongoose";

// ======================================
// 1. TypeScript Interface
// ======================================

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ======================================
// 2. Schema Definition
// ======================================

const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 8,
    },

    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // expires in 10 mins
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ======================================
// 3. TTL Index (Auto-delete expired OTPs)
// ======================================

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ======================================
// 4. Model Export (Next.js Hot Reload Safe)
// ======================================

export const OTPModel: Model<IOTP> =
  mongoose.models.OTP ||
  mongoose.model<IOTP>("OTP", otpSchema, "otps");

export default OTPModel;
