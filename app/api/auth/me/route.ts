import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { isAuthenticated } from "@/lib/myAuthentication";

export async function GET() {
  await dbConnect();

  const auth = await isAuthenticated(); // ✅ no role check

  if (!auth.isAuth || !auth.userId) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const user = await UserModel.findById(auth.userId).select("-password");

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user,
  });
}
