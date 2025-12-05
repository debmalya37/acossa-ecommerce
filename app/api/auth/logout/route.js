import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import { cookies } from "next/headers";

export async function POST(request){
    try{
        await dbConnect()
        const cookieStore = await cookies()
        cookieStore.delete('access_token')
        return response(true, 200, 'Logout successfully.')
    }catch(error){
        catchError(error)
    }
}