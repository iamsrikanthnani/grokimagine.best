import { Model, Schema, model, models, Document } from "mongoose";

interface ImagineDocument extends Document {
  xHandle: string;
  prompt: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  likes: number;
  dislikes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ImagineSchema = new Schema<ImagineDocument>({
  xHandle: { type: String, required: true },
  prompt: { type: String, required: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, required: true, enum: ["image", "video"] },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Imagine: Model<ImagineDocument> =
  models?.Imagine || model<ImagineDocument>("Imagine", ImagineSchema);
