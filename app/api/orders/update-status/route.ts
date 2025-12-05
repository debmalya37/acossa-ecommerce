import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import orderModel from "@/models/Order";

// ✅ REGISTER MODELS
import "@/models/Product";
import "@/models/Productvariant";
import "@/models/Media";

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const {_id, status} = await request.json();

        if(!_id || !status) {
            console.log('_id or status missing');
            return response(false, 400, 'Order ID and status are required');
        }



        const orderData = await orderModel.findById(_id)

        if(!orderData) {
            return response(false, 404, 'Order not found');
        }

        orderData.status = status;
        await orderData.save();

        return response(true, 200, 'Order Status Updated Successfully', orderData);

    } catch (error) {
        return catchError(error);
    }
}