import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import ReviewModel from "@/models/Review";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get("productId");
        if(!productId) {
            return response(false, 404, "Product ID is missing");

        }

        const reviews = await ReviewModel.aggregate([
            {
                $match: {
                    product: new mongoose.Types.ObjectId(productId),
                    deletedAt: null,
                }
            },
            {
                $group: {_id: "$rating", count: {$sum: 1}}
            },
            {
                $sort: {_id: -1}
            }
        ])

        const totalReview = reviews.reduce((sum, r)=> sum + r.count, 0);
        // avg rating 
        const averageRating = totalReview > 0 
        ? 
        (reviews.reduce((sum, r )=> sum + (r._id * r.count), 0) / totalReview).toFixed(1)
        : "0.0"
        
        
        
        const rating = reviews.reduce((acc, r )=> {
            acc[r._id] = r.count;
            return acc;
        } , {})
        const percentage = reviews.reduce((acc, r )=> {
            acc[r._id] = (r.count / totalReview) * 100;
            return acc;
        } , {})
        
        return response(true, 200, "Reviews fetched successfully", {totalReview, averageRating, rating, percentage});

    } catch (error) {
        return catchError(error);
    }
}