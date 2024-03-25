import { ObjectId } from "@/db";

export const BlogAccess = {
  userId: {
    type: ObjectId,
  },
  blogId: {
    type: ObjectId,
  },
  access: {
    type: String,
    enum: ["read", "write", "delete", "rate", "comment", "recommend"],
  },
  commentId: {
    type: ObjectId,
  },
  rate: {
    type: Number,
    min: 1,
    max: 5,
  },
  latestAccess: {
    type: Number,
  },
};

export const option = {
  timestamps: true,
};
