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
  createdAt?: Date; // exact
  updatedAt?: Date; // exact
  since?: Date; // createdAt >= since
  until?: Date; // createdAt <= until
  limit?: number;
  skip?: number;
  sort?: "likes" | "new" | "old";
}) => {
  await connectToDatabase();
  const { limit = 10, skip = 0, since, until, sort, ...rest } = query;
  const cleaned = Object.fromEntries(
    Object.entries(rest).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );
  const filter: Record<string, unknown> = { ...cleaned };
  if (since || until) {
    filter.createdAt = {
      ...(since ? { $gte: since } : {}),
      ...(until ? { $lte: until } : {}),
    };
  }
  const sortStage: Record<string, 1 | -1> =
    sort === "likes"
      ? { likes: -1 as -1, createdAt: -1 as -1 }
      : sort === "old"
      ? { createdAt: 1 as 1 }
      : { createdAt: -1 as -1 };
  const [imagines, total] = await Promise.all([
    Imagine.find(filter).sort(sortStage).skip(skip).limit(limit),
    Imagine.countDocuments(filter),
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
