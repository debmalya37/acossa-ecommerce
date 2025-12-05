import { isAuthenticated } from "@/lib/authentication";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";

import orderModel from "@/models/Order";
// 🔥 FORCE MODEL REGISTRATION
import "@/models/Product";
import "@/models/Productvariant";
import "@/models/ProductAddon";
import "@/models/Media";



export async function GET() {
    try {
        await dbConnect();
        const auth = await isAuthenticated('user');
        if(!auth.isAuth) {
            return response(false, 401, 'Unauthorized');
        }

        const userId = auth.userId

        // get recent orders
        const Orders = await orderModel.find({ user: userId }).populate('products.productId', 'name slug').populate({
            path: 'products.variantId',
            populate: {path: 'media'}
        }).lean();

        // get total order count 
        // const totalOrder = await orderModel.countDocuments({ user: userId });

        return response(true, 200, 'Order Info fetched successfully', {
            // totalOrder,
            Orders
        });
    } catch (error) {
        return catchError(error);
    }
}