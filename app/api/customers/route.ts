/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAuthenticated } from "@/lib/authentication"
import dbConnect from "@/lib/dbConnect"
import { catchError } from "@/lib/helper"
import UserModel from "@/models/User"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        // const auth = await isAuthenticated('admin')
        // if (!auth.isAuth) {
        //     return response(false, 403, 'Unauthorized.')
        // }
        await dbConnect()
        const searchParams = request.nextUrl.searchParams
        //extract query parameters

        const start = parseInt(searchParams.get('start') || "0", 10)
        const size = parseInt(searchParams.get('size') || "10", 10)
        const filters = JSON.parse(searchParams.get('filters') || "[]") as { id: string, value: string }[]
        const globalFilter = searchParams.get('globalFilter') || ""
        const sorting = JSON.parse(searchParams.get('sorting') || "[]")
        const deleteType = searchParams.get('deleteType') 

        //build match query
        let matchQuery: Record<string, any> = {}
        if(deleteType === 'SD'){
            matchQuery = {deletedAt:null}
        }else if(deleteType === 'PD'){
            matchQuery = {deletedAt:{$ne:null}}
        }

        if(globalFilter){
            matchQuery["$or"] = [
                {name: {$regex: globalFilter, $options:'i'}},
                {email: {$regex: globalFilter, $options:'i'}},
                {phone: {$regex: globalFilter, $options:'i'}},
                {address: {$regex: globalFilter, $options:'i'}},
                {isEmailVerified: {$regex: globalFilter, $options:'i'}},
            ]
        }

        //column filtration
        filters.forEach((filter) => {
                matchQuery[filter.id] = {$regex: filter.value, $options:'i'}        
        })


        //sorting
        const sortQuery: Record<string, 1 | -1> = {};

        sorting.forEach((sort:any)=>{
            sortQuery[sort.id] = (sort.desc ? -1: 1) as 1 | -1;
        })

        //agrregate pipeline
        const aggregatePipeline =[
            {$match: matchQuery},
            {
    $sort: Object.keys(sortQuery).length
      ? sortQuery
      : ({ createdAt: -1 } as Record<string, 1 | -1>)
  },
            {$skip: start},
            {$limit: size},
            {
                $project: {
                    _id:1,
                    name:1,
                    email:1,
                    phone:1,
                    address:1,
                    avatar:1,
                    isEmailVerified:1,
                    createdAt:1,
                    updatedAt:1,
                    deletedAt:1
                }
            }
        ]

        //execute query

        const getUser = await UserModel.aggregate(aggregatePipeline)


        //get totalRowCCount
        const totalRowCount = await UserModel.countDocuments(matchQuery)

        return NextResponse.json({
            data:getUser,
            meta:{totalRowCount},
            success:true,
        })


    }catch(error){
        return catchError(error)
    }
}