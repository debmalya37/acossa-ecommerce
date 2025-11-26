import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import User, { IUser } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email & password required");
        }

        await dbConnect();

        const user: IUser = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) throw new Error("User not found");

        if (!user.password) {
          throw new Error("Account exists with Google login. Use Google sign in.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: String(user._id).toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        };
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      async profile(profile) {
        return { ...profile };
      }
    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();

        const existing = await User.findOne({ email: user.email });

        if (!existing) {
          await User.create({
            name: user.name,
            email: user.email,
            password: "", // google account = no password
            role: "user",
            avatar: { url: user.image || "" },
            isEmailVerified: true,
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.isEmailVerified = (user).isEmailVerified;
      }
      return token;
    },

    async session({ session, token }) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          isEmailVerified: token.isEmailVerified as boolean,
          phone: token.phone as string,
        };
        return session;
      },
  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
