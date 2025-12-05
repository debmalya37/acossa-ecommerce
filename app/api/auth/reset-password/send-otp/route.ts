import { otpEmail } from "@/email/otpEmail";
import dbConnect from "@/lib/dbConnect";
import { catchError, generateOTP, response } from "@/lib/helper";
import { sendMail } from "@/lib/sendMail";
import zodSchema from "@/lib/zodSchema";
import OTPModel from "@/models/Otp";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    try {
        await dbConnect()
        const payload = await request.json()
        const validationSchema = zodSchema.pick({
            email: true
        })
        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input field', validatedData.error)
        }
        const { email } = validatedData.data
        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean()
        if (!getUser) {
            return response(false, 404, 'User not found')
        }
        await OTPModel.deleteMany({ email })
        const otp = generateOTP()
        const newOtpData = new OTPModel({ email, otp })
        await newOtpData.save()
        const otpSendStatus = await sendMail('Your login verification code.', email, otpEmail(otp))
        if (!otpSendStatus.success) {
            return response(false, 400, 'Failed to resend otp.')
        }
        return response(true, 200, 'Please verify your device.')


    } catch (error) {
        catchError(error)
    }
}