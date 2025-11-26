/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import ProductVariantModel, { IProductVariantPopulated } from "@/models/Productvariant";


export async function POST(request: Request) {

    try {
        await dbConnect();
        const payload = await request.json();
        const verifiedCartData = await Promise.all(
            payload.map(async (cartItem:any) => {
                const variant = await ProductVariantModel.findById(cartItem.variantId)
  .populate("product")
  .populate("media", "secure_url")
  .lean<IProductVariantPopulated>();

                if (variant) {
                    return {
                        productId: variant.product._id,
                        variantId: variant._id,
                        name: variant.product?.name as any,
                        url: variant.product?.slug as any,
                        media: variant.media?.[0]?.secure_url || null,
                        mrp: variant.mrp,
                        color: variant.color,
                        size: variant.size as any,
                        sellingPrice: variant.sellingPrice,
                        qty: cartItem.qty as any


                    }
                }
            })
        )

       return response(true, 200, "Cart verified successfully", verifiedCartData);

    } catch (error) {
        return catchError(error);
    }
    
}