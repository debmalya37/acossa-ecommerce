import { isAuthenticated } from "@/lib/authentication";
import dbConnect from "@/lib/dbConnect";
import { catchError,response } from "@/lib/helper";
import UserModel from "@/models/User";
import { NextRequest } from "next/server";




export async function PUT(request: NextRequest){
    try{    
        // const auth = await isAuthenticated('admin')
        // if(!auth.isAuth){
        //     return response(false, 403, 'Unauthorized')
        // }
        await dbConnect()
        const payload = await request.json()
        const ids = payload.ids || []
        const deleteType = payload.deleteType
        if(!Array.isArray(ids) || ids.length === 0){
            return response(false, 400, 'Invalid or Empty Id List')
        }
        const user = await UserModel.find({_id:{$in:ids}}).lean()
        if(!user.length){
            return response(false, 404, 'Data not found.')
        }
        if(!['SD','RSD'].includes(deleteType)){
            return response(false, 400, 'Invalid delete operation. Delete type should be SD or RSD for this route.')
        }
        if(deleteType === 'SD'){
            await UserModel.updateMany({_id:{$in:ids}},{$set:{deletedAt:new Date().toISOString()}})
        }else{
            await UserModel.updateMany({_id:{$in:ids}},{$set:{deletedAt:null}})
        }
        return response(true, 200, deleteType === 'SD' ? 'Data moved into trash.':'Data restored')

    }catch(error){
        return catchError(error)
    }
}


export async function DELETE(request: NextRequest){
    try{    
        // const auth = await isAuthenticated('admin')
        // if(!auth.isAuth){
        //     return response(false, 403, 'Unauthorized')
        // }
        await dbConnect()
        const payload = await request.json()
        const ids = payload.ids || []
        const deleteType = payload.deleteType
        if(!Array.isArray(ids) || ids.length === 0){
            return response(false, 400, 'Invalid or Empty Id List')
        }
        const user = await UserModel.find({_id:{$in:ids}}).lean()
        if(!user.length){
            return response(false, 404, 'Data not found.')
        }
        if(deleteType !== 'PD'){
            return response(false, 400, 'Invalid delete operation. Delete type should be PD for this route.')
        }
       await UserModel.deleteMany({_id: { $in : ids }})
       return response(true, 200, 'Data deleted permanently')

    }catch(error){
        return catchError(error)
    }
}