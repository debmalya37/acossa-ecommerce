import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  role: "user" | "admin";
  name: string;
  email: string;
  password: string;
  avatar?: {
    url: string;
    public_id?: string;
  };
  isEmailVerified: boolean;
  phone?: string;
  address?: string;
  deletedAt?: Date | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
      index: true, 
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name is too short"],
      maxlength: [50, "Name too long"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
      trim: true,
    },

    avatar: {
      url: {
        type: String,
        trim: true,
        default: "",
      },
      public_id: {
        type: String,
        trim: true,
      },
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 15,
      index: true,
    },

    address: {
      type: String,
      trim: true,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true, 
    },
  },
  {
    timestamps: true
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);

  next();
});


userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};


const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema, "users");

export default User;
