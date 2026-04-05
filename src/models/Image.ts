import dayjs from "dayjs";
import mongoose, { Document, Model, Schema, Types } from "mongoose";

import {
  IMAGE_USAGE_MODEL,
  IMAGE_USAGE_TYPE,
  ImageUsageModel,
  ImageUsageType,
} from "@/types/image";

/** Image usage sub-document interface (Mongoose schema level) */
export interface IImageUsage {
  type: ImageUsageType;
  refId: Types.ObjectId;
  model: ImageUsageModel;
}

/** Image document interface (Mongoose schema level) */
export interface IImage {
  _id: Types.ObjectId;
  publicId: string;
  url: string;
  hash: string;
  isPending: boolean;
  createdAt: number;
  uploadedAt: number;
  updatedAt: number | null;
  usage: IImageUsage | null;
}

/** Image document interface (extends mongoose Document) */
export interface IImageDocument extends IImage, Document {}

const ImageUsageSchema = new Schema<IImageUsage>(
  {
    type: {
      type: String,
      enum: Object.values(IMAGE_USAGE_TYPE),
      required: true,
    },
    refId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    model: {
      type: String,
      enum: Object.values(IMAGE_USAGE_MODEL),
      required: true,
    },
  },
  { _id: false },
);

const ImageSchema = new Schema<IImageDocument>(
  {
    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
      unique: true,
    },
    url: {
      type: String,
      required: [true, "Image URL is required"],
    },
    hash: {
      type: String,
      required: [true, "Image hash is required"],
    },
    isPending: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Number,
      default: () => dayjs().unix(),
    },
    uploadedAt: {
      type: Number,
      default: () => dayjs().unix(),
    },
    updatedAt: {
      type: Number,
      default: null,
    },
    usage: {
      type: ImageUsageSchema,
      default: null,
    },
  },
  { versionKey: false },
);

/**
 * Index for cleanup job - find pending images older than X days
 */
ImageSchema.index({ isPending: 1, uploadedAt: 1, createdAt: 1 });

/**
 * Index for finding images by usage
 */
ImageSchema.index({ "usage.model": 1, "usage.refId": 1 });

const Image: Model<IImageDocument> =
  mongoose.models.Image || mongoose.model<IImageDocument>("Image", ImageSchema);

export default Image;
