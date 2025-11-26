import { NextRequest } from "next/server";
import dbconnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import zodSchema from "@/lib/zodSchema";
import CategoryModel from "@/models/Category";
import z from "zod";

/* -------------------------------------------------------
   Extract Zod Schema for Category Create
-------------------------------------------------------- */
const createCategorySchema = zodSchema.pick({
  name: true,
  slug: true,
});

// Correct TypeScript inference:
type CreateCategoryPayload = z.infer<typeof createCategorySchema>;

/* -------------------------------------------------------
   POST → Create Category
-------------------------------------------------------- */
export async function POST(request: NextRequest) {
  try {
    // Optional Admin Authentication
    // const auth = await isAuthenticated("admin");
    // if (!auth.isAuth) return response(false, 403, "Unauthorized");

    await dbconnect();

    const payload: CreateCategoryPayload = await request.json();

    // Validate with Zod
    const validation = createCategorySchema.safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "Invalid or missing fields.", validation.error);
    }

    const { name, slug } = validation.data;

    // Create and save category
    await CategoryModel.create({ name, slug });

    return response(true, 200, "Category added successfully.");
  } catch (error) {
    return catchError(error);
  }
}
