
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import zodSchema from "@/lib/zodSchema";
import UserModel from "@/models/User";

export async function PUT(request: Request) {
    try{
        await dbConnect()
        const payload = await request.json()
        const validattionSchema = zodSchema.pick({
            email:true, password:true
        })
        const validatedData = validattionSchema.safeParse(payload)
        if(!validatedData.success){
            return response(false,401,'Invalid or missing input field', validatedData.error)
        }
        const {email,password} = validatedData.data
        console.log("updatepassword",email,password)
        const getUser= await UserModel.findOne({deletedAt:null, email}).select("+password")
        if(!getUser){
            return response(false,404,'User not found')
        }
        getUser.password = password
        await getUser.save()
        return response(true, 200, 'Password update success.')
    }catch(error){
        catchError(error)
    }
}
