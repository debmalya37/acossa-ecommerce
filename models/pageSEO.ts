import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPageSEO extends Document {
  path: string;           // "/", "/shop", "/about"
  title: string;
  description: string;
  updatedAt: Date;
}

const pageSEOSchema = new Schema<IPageSEO>(
  {
    path: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 70,
    },
    description: {
      type: String,
      required: true,
      maxlength: 160,
    },
  },
  { timestamps: true, versionKey: false }
);

export const PageSEOModel: Model<IPageSEO> =
  mongoose.models.PageSEO ||
  mongoose.model<IPageSEO>("PageSEO", pageSEOSchema);

export default PageSEOModel;
