import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductAddonModel from "@/models/ProductAddon";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  await ProductAddonModel.findByIdAndUpdate(id, {
    deletedAt: new Date(),
  });

  return NextResponse.json({
    success: true,
    message: "Addon deleted",
  });
}
