import { isAuthenticated } from "@/lib/authentication";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import orderModel from "@/models/Order";
import MediaModel from "@/models/Media";
import ProductModel from "@/models/Product";
import ProductAddon from "@/models/ProductAddon";
import  "@/models/Productvariant";

export async function GET() {
    try {
        await dbConnect();
        const auth = await isAuthenticated('user');
        if(!auth.isAuth) {
            return response(false, 401, 'Unauthoriz ed');
        }

        const userId = auth.userId

        // get recent orders
        const recentOrders = await orderModel.find({ user: userId }).populate('products.productId', 'name slug').populate({
            path: 'products.variantId',
            populate: {path: 'media'}
        }).limit(10).lean();

        // get total order count 
        const totalOrder = await orderModel.countDocuments({ user: userId });

        return response(true, 200, 'User dashboard data fetched successfully', {
            totalOrder,
            recentOrders
        });
    } catch (error) {
        return catchError(error);
    }
}