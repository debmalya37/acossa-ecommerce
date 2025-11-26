import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { SignJWT } from "jose"; 
import { sendMail } from "@/lib/sendMail";
import { emailVerificationLink } from "@/email/emailVerificationLink";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { fullName, email, password, phone, role } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email & password are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (phone && !/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Enter valid 10-digit phone number" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    const newUser = await User.create({
      name: fullName,
      email,
      password, // will be hashed by mongoose pre-save
      phone: phone || "",
      role: role || "user",
      isEmailVerified: false
    });
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const token = await new SignJWT({ userId: String(newUser._id) })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);


      await sendMail("Email verification request from saree ecommerce", 
        email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${token}`)
      )

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully, and email sent for verification",
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        }
      },
      { status: 201 }
    );

    
    
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
