export type TYPE_IMAGINE = {
  _id?: string;
  xHandle: string;
  prompt: string;
  mediaUrl: string;
  mediaType: MediaType;
  likes?: number;
  dislikes?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MediaType = "image" | "video";

export type Imagine = {
  _id: string;
  xHandle: string;
  prompt: string;
  mediaUrl: string;
  mediaType: MediaType;
  likes: number;
  dislikes?: number;
  createdAt: string;
  updatedAt: string;
};

export type GetAllResponse = {
  items: Imagine[];
  total: number;
  limit: number;
  skip: number;
};

export type GetAllParams = {
  limit?: number;
  xHandle?: string;
  prompt?: string;
  mediaType?: MediaType;
  since?: string;
  until?: string;
};
