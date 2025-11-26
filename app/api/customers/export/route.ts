import dbConnect from "@/lib/dbConnect";
import { isAuthenticated } from "@/lib/authentication";
import { catchError,  response } from "@/lib/helper";
import UserModel from "@/models/User";
import { NextRequest } from "next/server";



export async function GET(request: NextRequest){
    try{
        // const auth = await isAuthenticated('admin')
        // if(!auth.isAuth){
        //     return response(false, 403, 'Unauthorized')
        // }
        await dbConnect()
        
        const filter = {
            deletedAt:null
        }
        const getCustomers = await UserModel.find(filter).sort({createdAt:-1}).lean()
        if(!getCustomers){
            return response(false, 404, 'Collection empty.')
        }
        return response(true, 200, 'Data found', getCustomers)
    }catch(error){
        return catchError(error)
    }
}