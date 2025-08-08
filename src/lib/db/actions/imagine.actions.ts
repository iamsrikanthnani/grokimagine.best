import { TYPE_IMAGINE } from "@/types";
import { connectToDatabase, Imagine } from "@/lib";

export const createImagine = async (imagine: TYPE_IMAGINE) => {
  await connectToDatabase();
  const newImagine = new Imagine(imagine);
  await newImagine.save();
  return newImagine;
};

export const getImagine = async (id: string) => {
  await connectToDatabase();
  const imagine = await Imagine.findById(id);
  return imagine;
};

export const getImagines = async (query: {
  xHandle?: string;
  prompt?: string;
  mediaType?: "image" | "video";
  likes?: number;
  dislikes?: number;
  createdAt?: Date;
  updatedAt?: Date;
  limit?: number;
  skip?: number;
}) => {
  await connectToDatabase();
  const { limit = 10, skip = 0, ...rest } = query;
  const [imagines, total] = await Promise.all([
    Imagine.find(rest).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Imagine.countDocuments(rest),
  ]);
  return { items: imagines, total };
};

export const likeImagine = async (id: string) => {
  await connectToDatabase();
  const imagine = await Imagine.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  return imagine;
};

export const unlikeImagine = async (id: string) => {
  await connectToDatabase();
  const imagine = await Imagine.findByIdAndUpdate(
    id,
    { $inc: { likes: -1 } },
    { new: true }
  );
  return imagine;
};

export const dislikeImagine = async (id: string) => {
  await connectToDatabase();
  const imagine = await Imagine.findByIdAndUpdate(
    id,
    { $inc: { dislikes: 1 } },
    { new: true }
  );
  return imagine;
};
