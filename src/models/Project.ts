import dayjs from 'dayjs';
import mongoose, { Document, Model, Schema, Types } from 'mongoose';

import { generateSlug } from '@/shared/utils/slug';

/** Project type */
export type ProjectType = 'WEB' | 'APP' | 'HYBRID';

/** Project document interface (Mongoose schema level) */
export interface IProject {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  // Basic info
  title: string;
  slug: string;
  description: string;
  type: ProjectType;

  // Relations
  tags: Types.ObjectId[];
  stacks: Types.ObjectId[];

  // Status
  isFeatured: boolean;
  isVisible: boolean;

  // Links
  link: string | null;
  partner: string | null;

  // Images
  cover: Types.ObjectId | null;
  gallery: Types.ObjectId[];

  // Timestamps
  createdAt: number;
  updatedAt: number | null;
}

/** Project document interface */
export interface IProjectDocument extends IProject, Document {}

/**
 * Project type enum values
 */
export const PROJECT_TYPES: ProjectType[] = ['WEB', 'APP', 'HYBRID'];

const ProjectSchema = new Schema<IProjectDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Basic info
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: PROJECT_TYPES,
      required: [true, 'Type is required'],
    },

    // Relations
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    stacks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Stack',
      },
    ],

    // Status
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },

    // Links
    link: {
      type: String,
      default: null,
      trim: true,
    },
    partner: {
      type: String,
      default: null,
      trim: true,
    },

    // Images
    cover: {
      type: Schema.Types.ObjectId,
      ref: 'Image',
      default: null,
    },
    gallery: {
      type: [Schema.Types.ObjectId],
      ref: 'Image',
      default: [],
    },

    // Timestamps
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
 * Indexes
 */
ProjectSchema.index({ userId: 1 });
ProjectSchema.index({ type: 1 });
ProjectSchema.index({ isFeatured: 1 });
ProjectSchema.index({ isVisible: 1 });
ProjectSchema.index({ title: 'text' });

/**
 * Auto-generate slug from title before save
 */
ProjectSchema.pre('save', function () {
  if (this.isNew || this.isModified('title')) {
    this.slug = generateSlug(this.title);
  }
  if (!this.isNew) {
    this.updatedAt = dayjs().unix();
  }
});

const Project: Model<IProjectDocument> =
  mongoose.models.Project ||
  mongoose.model<IProjectDocument>('Project', ProjectSchema);

export default Project;
