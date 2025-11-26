import { NextRequest } from "next/server";
import dbconnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import zodSchema from "@/lib/zodSchema";
import ReviewModel from "@/models/Review";
import z from "zod";

/* -------------------------------------------------------
   Extract Zod Schema for Category Create
-------------------------------------------------------- */
const createReviewSchema = zodSchema.pick({
  product: true,
  userId: true,
  rating: true,
  review: true,
  title: true,
});

// Correct TypeScript inference:
type CreateReviewPayload = z.infer<typeof createReviewSchema>;

/* -------------------------------------------------------
   POST → Create Review
-------------------------------------------------------- */
export async function POST(request: NextRequest) {
  try {
    // Optional Admin Authentication
    // const auth = await isAuthenticated("user");
    // if (!auth.isAuth) return response(false, 403, "Unauthorized");

    await dbconnect();

    const payload: CreateReviewPayload = await request.json();

    // Validate with Zod
    const validation = createReviewSchema.safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "Invalid or missing fields.", validation.error);
    }

    
    const { product, userId, rating, review, title } = validation.data;

    // Create and save category
    const newReview =  new ReviewModel({
        product: product,
        user: userId,
        rating: rating,
        title: title,
        review: review
    });
    await newReview.save();
    // await ReviewModel.create({ product, userId, rating, review, title });

    return response(true, 200, "Review added successfully.");
  } catch (error) {
    return catchError(error);
  }
}
