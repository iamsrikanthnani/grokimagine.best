export type TYPE_IMAGINE = {
  _id?: string;
  xHandle: string;
  prompt: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  likes?: number;
  dislikes?: number;
  createdAt?: Date;
  updatedAt?: Date;
};
