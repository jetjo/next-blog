import { ObjectId } from "@/db";

export const BlogAccess = {
  userId: {
    type: ObjectId,
    unique: false,
    ref: "User",
  },
  blogId: {
    type: ObjectId,
    unique: false,
    ref: "Blog",
  },
  access: {
    type: String,
    enum: ["read", "write", "delete", "rate", "comment", "recommend"],
  },
  commentId: {
    type: ObjectId,
    unique: false,
    ref: "Comment",
  },
  rate: {
    type: Number,
    min: 1,
    max: 5,
  },
  latestAccess: {
    type: Number,
  },
} as const;

export const option = {
  timestamps: true,
};
