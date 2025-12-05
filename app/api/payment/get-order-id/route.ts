import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import zodSchema from "@/lib/zodSchema";
import Razorpay from "razorpay";
export async function POST(request: Request) {
    try {
        await dbConnect()
        const payload = await request.json()
        const schema = zodSchema.pick({
            amount: true,
        })

        const validate = schema.safeParse(payload);
        if (!validate.success) {
            return response(false, 400, 'Invalid request data', { errors: validate.error });
        }
        const { amount } = validate.data;
        const razInstance  = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_KEY_SECRET || '',
        })

        const razOptions = {
            amount: Number(amount) * 100,  // amount in the smallest currency unit
            currency: "USD",
        }

        const orderDetail = await razInstance.orders.create(razOptions);
        const order_id = orderDetail.id;

        return response(true, 200, 'Order ID generated successfully', { order_id });
    } catch (error) {
        return catchError(error);
    }
}