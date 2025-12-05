import { isAuthenticated } from "@/lib/authentication";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import User from "@/models/User";




export async function GET() {
    try {
        await dbConnect();
        const auth = await isAuthenticated('user');
        if(!auth.isAuth) {
            return response(false, 401, 'Unauthorized');
        }

        const userId = auth.userId;

        const user = await User.findById(userId).lean();
        if(!user) {
            return response(false, 404, 'User not found');
        }

        return response(true, 200, 'Profile fetched successfully', user)

    } catch (error) {
        return catchError(error);
    }
}