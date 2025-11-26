import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";


export async function POST(req: Request) {
  try {
    await dbConnect();
    const { fullName, email, phone, password, role } = await req.json();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    await User.create({
      name: fullName,
      email,
      phone,
      password,
      role: role || "user",
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? (err as Error).message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
