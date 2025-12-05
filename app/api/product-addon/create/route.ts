import dbConnect from "@/lib/dbConnect";
import { response, catchError } from "@/lib/helper";
import ProductAddonModel from "@/models/ProductAddon";
import z from "zod";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const schema = z.object({
      product: z.string().length(24),
      key: z.enum([
        "FALL_PICO",
        "EDGE_FINISH",
        "PRE_STITCHED",
        "SHAPEWEAR",
        "BLOUSE_STITCHING",
        "CUSTOM_NOTE",
      ]),
      label: z.string().min(1),
      type: z.enum(["checkbox", "radio", "select"]),
      basePrice: z.number().min(0),
      required: z.boolean().optional(),
      options: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
            price: z.number().min(0),
          })
        )
        .optional(),
      sortOrder: z.number().optional(),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return response(false, 422, "Validation error", parsed.error.format());
    }

    const addon = await ProductAddonModel.create({
      ...parsed.data,
      deletedAt: null,
    });

    return response(true, 201, "Addon created", addon);
  } catch (err) {
    return catchError(err);
  }
}
