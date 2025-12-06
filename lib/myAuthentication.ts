import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const isAuthenticated = async (role?: string) => {
  try {
    const cookieStore = await cookies();

    if (!cookieStore.has("access_token")) {
      return { isAuth: false };
    }

    const token = cookieStore.get("access_token")?.value;
    if (!token) {
      return { isAuth: false };
    }

    const { payload }: any = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    // ✅ Role check ONLY if role is provided
    if (role && payload.role !== role) {
      return { isAuth: false };
    }

    return {
      isAuth: true,
      userId: payload._id,
      role: payload.role,
    };
  } catch (error) {
    return {
      isAuth: false,
    };
  }
};
