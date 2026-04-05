import dayjs from "dayjs";
import mongoose, { Document, Model, Schema, Types } from "mongoose";

/**
 * Social platform enum
 */
export const SOCIAL_PLATFORM = {
  GITHUB: "GITHUB",
  LINKEDIN: "LINKEDIN",
  LINE: "LINE",
  TELEGRAM: "TELEGRAM",
  WECHAT: "WECHAT",
} as const;

export type SocialPlatform =
  (typeof SOCIAL_PLATFORM)[keyof typeof SOCIAL_PLATFORM];

/** Social sub-document interface (Mongoose schema level) */
export interface ISocial {
  platform: SocialPlatform;
  url: string;
}

/** User document interface (Mongoose schema level) */
export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  avatar: Types.ObjectId | null;
  name: string;
  title: string;
  bio: string;
  socials: ISocial[];
  createdAt: number;
  updatedAt: number | null;
}

/** User document interface */
export interface IUserDocument extends IUser, Document {}

const SocialSchema = new Schema<ISocial>(
  {
    platform: {
      type: String,
      enum: Object.values(SOCIAL_PLATFORM),
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    avatar: {
      type: Schema.Types.ObjectId,
      ref: "Image",
      default: null,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    bio: {
      type: String,
      default: "",
    },
    socials: {
      type: [SocialSchema],
      default: [],
    },
    createdAt: {
      type: Number,
      default: () => dayjs().unix(),
    },
    updatedAt: {
      type: Number,
      default: null,
    },
  },
  { versionKey: false },
);

/**
 * Update updatedAt on save (only for existing documents)
 */
UserSchema.pre("save", function () {
  if (!this.isNew) {
    this.updatedAt = dayjs().unix();
  }
});

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;
