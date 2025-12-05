import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import { sendMail } from "@/lib/sendMail";
import zodSchema from "@/lib/zodSchema";
import orderModel from "@/models/Order";
import { orderNotification } from "@/email/orderNotification";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import { isAuthenticated } from "@/lib/authentication";
import z from "zod";

export async function POST(request: Request) {
  try {
    await dbConnect();

    /* ================= AUTH ✅ ================= */
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    const userId = auth.userId;

    console.log("Authenticated User ID in saving-order api:", userId);

    /* ================= PAYLOAD ================= */
    const payload = await request.json();

    const addonSchema = z.object({
  key: z.string(),
  label: z.string(),
  basePrice: z.number().min(0),

  option: z
    .object({
      value: z.string(),
      label: z.string(),
      price: z.number().min(0),
    })
    .nullable()
    .optional(),

  totalPrice: z.number().min(0),
});

const productSchema = z.object({
  productId: z.string().length(24),
  variantId: z.string().length(24),
  name: z.string().min(1),
  qty: z.number().min(1),
  mrp: z.number().min(0),
  sellingPrice: z.number().min(0),

  addons: z.array(addonSchema).optional(),
  finalPrice: z.number().min(0),
});


    const orderSchema = zodSchema
      .pick({
        name: true,
        phone: true,
        email: true,
        country: true,
        state: true,
        city: true,
        pinCode: true,
        landmark: true,
        orderNote: true,
      })
      .extend({
        razorpay_payment_id: z.string().min(3),
        razorpay_order_id: z.string().min(3),
        razorpay_signature: z.string().min(3),
        subtotal: z.number().min(0),
        discount: z.number().min(0),
        couponDiscountAmount: z.number().min(0),
        totalAmount: z.number().min(0),
        products: z.array(productSchema),
      });

    const validate = orderSchema.safeParse(payload);
    if (!validate.success) {
      return response(false, 422, "Validation Error", validate.error);
    }

    const data = validate.data;

    /* ================= PAYMENT VERIFY ================= */
    const paymentVerification = validatePaymentVerification(
      {
        order_id: data.razorpay_order_id,
        payment_id: data.razorpay_payment_id,
      },
      data.razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET || ""
    );

    /* ================= SAVE ORDER ================= */
    await orderModel.create({
      user: userId, // ✅ CORRECT SOURCE
      name: data.name,
      phone: data.phone,
      email: data.email,
      country: data.country,
      state: data.state,
      city: data.city,
      pinCode: data.pinCode,
      landmark: data.landmark,
      orderNote: data.orderNote,
      products: data.products,
      subtotal: data.subtotal,
      discount: data.discount,
      couponDiscountAmount: data.couponDiscountAmount,
      totalAmount: data.totalAmount,
      payment_id: data.razorpay_payment_id,
      order_id: data.razorpay_order_id,
      status: paymentVerification ? "pending" : "unverified",
    });

    /* ================= EMAIL ================= */
    try {
      await sendMail(
        "Your Order placed successfully",
        data.email,
        orderNotification({
          order_id: data.razorpay_order_id,
          orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${data.razorpay_order_id}`,
        })
      );
    } catch {
      /* email failure should not break order */
    }

    return response(true, 201, "Order saved successfully");
  } catch (error) {
    return catchError(error);
  }
}
