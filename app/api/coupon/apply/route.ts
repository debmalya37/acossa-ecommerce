import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import zodSchema from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon";


export async function POST(request: Request) {

    try {
        await dbConnect();
        const payload = await request.json();
        const couponFormSchema = zodSchema.pick({
            code: true,
            minShoppingAmount: true,
        })

        const validate = couponFormSchema.safeParse(payload);
        if(!validate.success) {
            return new Response(JSON.stringify({
                success: false,
                message: "Invalid coupon data",
                errors: validate.error.format(),
            }), { status: 400 });
        }

        const { code, minShoppingAmount } = validate.data;
        const couponData = await CouponModel.findOne({code}).lean();

        if(!couponData) {
            return new Response(JSON.stringify({
                success: false,
                message: "Coupon not found",
            }), { status: 404 }); 
        }

        const validity = couponData.validity;
        if(!validity || new Date() > validity) {
            return response (false,400, "Coupon has expired", );
        }

        if(minShoppingAmount < couponData?.minShoppingAmount) {
            return response (false, 400, `Minimum shopping amount for this coupon is $${couponData.minShoppingAmount}`,);
        }

        return response (true,200, "Coupon applied successfully",  {
            discountPercentage: couponData.discountPercentage,
             
        });

    } catch (error) {
        catchError(error);
    }


}