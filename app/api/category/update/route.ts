import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import zodSchema from "@/lib/zodSchema";
import CategoryModel from "@/models/Category";
import { isValidObjectId } from "mongoose";
import z from "zod";

/* -----------------------------------------------------
   Zod Schema Extraction (Strongly Typed)
------------------------------------------------------ */
const updateCategorySchema = zodSchema.pick({
  _id: true,
  name: true,
  slug: true,
});

type UpdateCategoryPayload = z.infer<typeof updateCategorySchema>;


/* -----------------------------------------------------
   PUT → Update Category
------------------------------------------------------ */
export async function PUT(request: NextRequest) {
  try {
    // 🔐 OPTIONAL: Enable when auth needed
    // const auth = await isAuthenticated("admin");
    // if (!auth.isAuth) {
    //   return response(false, 403, "Unauthorized");
    // }

    await dbConnect();

    const payload: UpdateCategoryPayload = await request.json();

    // 🧪 Validate request body
    const validation = updateCategorySchema.safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "Invalid or missing fields.", validation.error);
    }

    const { _id, name, slug } = validation.data;

    // 🔍 ObjectId validation
    if (!isValidObjectId(_id)) {
      return response(false, 400, "Invalid category ID.");
    }

    // 📌 Find Category
    const category = await CategoryModel.findOne({
      _id,
      deletedAt: null,
    });

    if (!category) {
      return response(false, 404, "Category not found.");
    }

    // ✏️ Update Fields
    category.name = name;
    category.slug = slug;

    await category.save();

    return response(true, 200, "Category updated successfully.");
  } catch (error) {
    return catchError(error);
  }
}
