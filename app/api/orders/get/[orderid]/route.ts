import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import orderModel from "@/models/Order";

// ✅ REGISTER MODELS
import "@/models/Product";
import "@/models/Productvariant";
import "@/models/Media";

export async function GET(
  request: Request,
  context: { params: Promise<{ orderid: string }> }
) {
    try {
        await dbConnect();
        const getParams = await context.params;
        const orderid = getParams.orderid;

        if(!orderid) {
            return response(false, 400, 'Order not found');
        }
        const orderData = await orderModel.findOne({order_id: orderid}).populate('products.productId', 'name slug')
        .populate(
            {
                path: 'products.variantId',
                populate: {path: 'media'}
            }
        ).lean();

        if(!orderData) {
            return response(false, 404, 'Order not found');
        }

        return response(true, 200, 'Order found', orderData);

    } catch (error) {
        return catchError(error);
    }
}