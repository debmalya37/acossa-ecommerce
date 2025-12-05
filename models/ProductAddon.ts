import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProductAddon extends Document {
    product: Types.ObjectId;
    key:
    | "FALL_PICO"
    | "EDGE_FINISH"
    | "PRE_STITCHED"
    | "SHAPEWEAR"
    | "BLOUSE_STITCHING"
    | "CUSTOM_NOTE";
    label: string;
    type: "checkbox" | "radio" | "select";
  basePrice: number; // applied when addon is selected
  required: boolean;
  options?: {
    value: string;   // XS_34
    label: string;   // XS / 34
    price: number;   // ADDITIONAL price
  }[];

  sortOrder: number;

  deletedAt: Date | null;
}

const productAddonSchema = new Schema<IProductAddon>(
{
    product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
    },

    key: {
    type: String,
    required: true,
    enum: [
        "FALL_PICO",
        "EDGE_FINISH",
        "PRE_STITCHED",
        "SHAPEWEAR",
        "BLOUSE_STITCHING",
        "CUSTOM_NOTE",
    ],
    },

    label: {
    type: String,
    required: true,
    trim: true,
    },

    type: {
    type: String,
    enum: ["checkbox", "radio", "select"],
    required: true,
    default: "checkbox",
    },

    basePrice: {
    type: Number,
    default: 0,
    min: 0,
    },

    required: {
    type: Boolean,
    default: false,
    },

    options: [
    {
        value: { type: String, required: true },
        label: { type: String, required: true },
        price: { type: Number, default: 0 },
    },
    ],

    sortOrder: {
    type: Number,
    default: 0,
    },

    deletedAt: {
    type: Date,
    default: null,
    index: true,
    },
},
{ timestamps: true }
);

export default mongoose.models.ProductAddon ||
  mongoose.model<IProductAddon>("ProductAddon", productAddonSchema);
