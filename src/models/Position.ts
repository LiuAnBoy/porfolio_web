import dayjs from "dayjs";
import mongoose, { Document, Model, Schema, Types } from "mongoose";

/** Position document interface (Mongoose schema level) */
export interface IPosition {
  _id: Types.ObjectId;
  experienceId: Types.ObjectId;
  title: string;
  startAt: number;
  endAt: number | null;
  isCurrent: boolean;
  description: string;
  sn: number;
  createdAt: number;
  updatedAt: number | null;
}

/** Position document interface */
export interface IPositionDocument extends IPosition, Document {}

const PositionSchema = new Schema<IPositionDocument>(
  {
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Position title is required"],
      trim: true,
    },
    startAt: {
      type: Number,
      required: [true, "Start date is required"],
    },
    endAt: {
      type: Number,
      default: null,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "",
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
PositionSchema.index({ experienceId: 1 });
PositionSchema.index({ experienceId: 1, sn: 1 }, { unique: true });
PositionSchema.index({ experienceId: 1, title: 1 }, { unique: true });

/**
 * Update updatedAt on save (only for existing documents)
 */
PositionSchema.pre("save", function () {
  if (!this.isNew) {
    this.updatedAt = dayjs().unix();
  }
});

const Position: Model<IPositionDocument> =
  mongoose.models.Position ||
  mongoose.model<IPositionDocument>("Position", PositionSchema);

export default Position;
