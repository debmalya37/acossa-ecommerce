import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helper";
import User from "@/models/User";




export async function PUT(request: Request) {
    try {
        await dbConnect();
        const auth = await isAuthenticated('user');
        if(!auth.isAuth) {
            return response(false, 401, 'Unauthorized');
        }

        const userId = auth.userId;
        const user = await User.findById(userId);

        if(!user) {
            return response(false, 404, 'User not found');
        }


        const formData = await request.formData();
        const file = formData.get('file')

        user.name = formData.get('name') as string || user.name;
        user.phone = formData.get('phone') as string || user.phone;
        user.address = formData.get('address') as string || user.address;

      if(file) {
        const fileBuffer = await (file as File).arrayBuffer();
        const base64Image = `data:${(file as File).type};base64,${Buffer.from(fileBuffer).toString('base64')}`;
        
        const uploadFile = await cloudinary.uploader.upload(base64Image,
            {
                upload_preset: 'saree-ecomm',

            })

            // remove old avatar from cloudinary
            if(user?.avatar?.public_id) {
                await cloudinary.api.delete_resources([user.avatar.public_id]);
            }

            user.avatar = {
                url: uploadFile.secure_url,
                public_id: uploadFile.public_id,
            }
    }
    
    await user.save();

        return response(true, 200, 'Profile Updated successfully.', 
            {
                _id: user.id.toString(),
                role: user.role,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar,
            }
        )

    } catch (error) {
        return catchError(error);
    }
}