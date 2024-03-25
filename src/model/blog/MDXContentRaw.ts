import { ObjectId } from "@/db";

export const MDXContent = {
  content: {
    type: String,
  },
  blogId: {
    type: ObjectId,
    unique: true,
  },
};

export const option = {
  timestamps: true,
};
