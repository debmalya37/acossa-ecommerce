import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import ProductVariantModel, { IProductVariantPopulated } from "@/models/Productvariant";
import ProductAddon from "@/models/ProductAddon";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const payload = await request.json();

    const verifiedCartData = await Promise.all(
      payload.map(async (cartItem: any) => {
        const variant = await ProductVariantModel.findById(cartItem.variantId)
          .populate("product")
          .populate("media", "secure_url")
          .lean<IProductVariantPopulated>();

        if (!variant) return null;

        /* ✅ Fetch addons for product */
        const addonsFromDB = await ProductAddon.find({
          product: variant.product._id,
          deletedAt: null,
        }).lean();

        /* ✅ Verify addon prices */
        const verifiedAddons = (cartItem.addons || []).map((addon: any) => {
          const dbAddon = addonsFromDB.find(a => a.key === addon.key);
          if (!dbAddon) return null;

          let extra = dbAddon.basePrice || 0;

          if (addon.option) {
            const opt = dbAddon.options?.find((o:any) => o.value === addon.option.value);
            if (opt) extra += opt.price;
          }

          return {
            key: dbAddon.key,
            label: dbAddon.label,
            basePrice: dbAddon.basePrice,
            option: addon.option || null,
            totalPrice: extra,
          };
        }).filter(Boolean);

        const addonsTotal = verifiedAddons.reduce(
          (sum: number, a: any) => sum + a.totalPrice,
          0
        );

        const baseTotal = variant.sellingPrice * cartItem.qty;
        const finalPrice = baseTotal + addonsTotal;

        return {
          productId: variant.product._id,
          variantId: variant._id,
          name: variant.product?.name,
          url: variant.product?.slug,
          media: variant.media?.[0]?.secure_url || null,
          color: variant.color,
          size: variant.size,
          mrp: variant.mrp,
          sellingPrice: variant.sellingPrice,
          qty: cartItem.qty,
          addons: verifiedAddons,
          finalPrice,
        };
      })
    );

    return response(true, 200, "Cart verified successfully", verifiedCartData.filter(Boolean));
  } catch (error) {
    return catchError(error);
  }
}
