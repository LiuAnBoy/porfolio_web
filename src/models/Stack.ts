import dayjs from 'dayjs';
import mongoose, { Document, Model, Schema, Types } from 'mongoose';

import { generateSlug } from '@/shared/utils/slug';

/** Stack document interface (Mongoose schema level) */
export interface IStack {
  _id: Types.ObjectId;
  label: string;
  slug: string;
  createdAt: number;
  updatedAt: number | null;
}

/** Stack document interface */
export interface IStackDocument extends IStack, Document {}

const StackSchema = new Schema<IStackDocument>(
  {
    label: {
      type: String,
      required: [true, 'Label is required'],
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
StackSchema.pre('save', function () {
  if (this.isNew || this.isModified('label')) {
    this.slug = generateSlug(this.label);
  }
  if (!this.isNew) {
    this.updatedAt = dayjs().unix();
  }
});

const Stack: Model<IStackDocument> =
  mongoose.models.Stack || mongoose.model<IStackDocument>('Stack', StackSchema);

export default Stack;
