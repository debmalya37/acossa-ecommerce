import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;

  author: string;
  published: boolean;

  tags?: string[];
  categories?: string[];

  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },

    author: { type: String, default: "Acossa Editorial" },
    published: { type: Boolean, default: true, index: true },

    tags: { type: [String], default: [], index: true },
    categories: { type: [String], default: [], index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", BlogSchema);
