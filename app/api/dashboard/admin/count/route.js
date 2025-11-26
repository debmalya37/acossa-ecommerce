import { isAuthenticated } from "@/lib/authentication";
import dbConnect from "@/lib/dbConnect";
import { response } from "@/lib/helper";
import CategoryModel from "@/models/Category";
import ProductModel from "@/models/Product";
import UserModel from "@/models/User";

export async function GET(request){
    try{
        // const auth=await isAuthenticated('admin')
        // if(!auth.isAuth){
        //     return response(false,403, 'Unauthorized')
        // }
        await dbConnect()
        const [category, product, customer] = await Promise.all([
            CategoryModel.countDocuments({deletedAt:null}),
            ProductModel.countDocuments({deletedAt:null}),
            UserModel.countDocuments({deletedAt:null}),
        ])
        return response(true,200,'Dashboard count.',{
            category, product, customer
        } )
    }catch(error){
        return catchError(error)
    }
}