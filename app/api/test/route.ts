import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function GET() {
    await dbConnect;
    return NextResponse.json (
        {
            success: true,
            message: "Database connected" }
        );
}