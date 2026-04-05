import dayjs from "dayjs";
import mongoose, { Document, Model, Schema, Types } from "mongoose";

/** Experience document interface (Mongoose schema level) */
export interface IExperience {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  company: string;
  companyIcon: Types.ObjectId | null;
  sn: number;
  createdAt: number;
  updatedAt: number | null;
}

/** Experience document interface */
export interface IExperienceDocument extends IExperience, Document {}

const ExperienceSchema = new Schema<IExperienceDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    companyIcon: {
      type: Schema.Types.ObjectId,
      ref: "Image",
      default: null,
    },
    sn: {
      type: Number,
      default: 0,
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
 * Indexes
 */
ExperienceSchema.index({ userId: 1 });
ExperienceSchema.index({ userId: 1, sn: 1 });

/**
 * Update updatedAt on save (only for existing documents)
 */
ExperienceSchema.pre("save", function () {
  if (!this.isNew) {
    this.updatedAt = dayjs().unix();
  }
});

const Experience: Model<IExperienceDocument> =
  mongoose.models.Experience ||
  mongoose.model<IExperienceDocument>("Experience", ExperienceSchema);

export default Experience;
