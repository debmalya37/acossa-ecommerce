import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import { isValidObjectId } from "mongoose";
import ProductVariantModel from "@/models/Productvariant";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest) {
  try {

    await dbConnect();
    const getSize = await ProductVariantModel.aggregate([
        { $sort: {_id: 1}},
        {
            $group: {
                _id: "$size",
                first: { $first: "$_id" }
            }
        },
        {$sort: {first: 1}},
        {$project: {
            _id: 0,
            size: "$_id",
        }}
    ])

    if(!getSize.length){
        return response(false, 400, "Size not found", []);
    }

    const sizes = getSize.map((item) => item.size);


    return response(true, 200, "Size found", sizes);
  } catch (error) {
    return catchError(error);
  }
}
