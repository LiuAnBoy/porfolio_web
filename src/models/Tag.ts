import dayjs from "dayjs";
import mongoose, { Document, Model, Schema, Types } from "mongoose";

import { generateSlug } from "@/shared/utils/slug";

/** Tag document interface (Mongoose schema level) */
export interface ITag {
  _id: Types.ObjectId;
  label: string;
  slug: string;
  createdAt: number;
  updatedAt: number | null;
}

/** Tag document interface */
export interface ITagDocument extends ITag, Document {}

const TagSchema = new Schema<ITagDocument>(
  {
    label: {
      type: String,
      required: [true, "Label is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
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
 * Auto-generate slug from label before save
 */
TagSchema.pre("save", function () {
  if (this.isNew || this.isModified("label")) {
    this.slug = generateSlug(this.label);
  }
  if (!this.isNew) {
    this.updatedAt = dayjs().unix();
  }
});

const Tag: Model<ITagDocument> =
  mongoose.models.Tag || mongoose.model<ITagDocument>("Tag", TagSchema);

export default Tag;
