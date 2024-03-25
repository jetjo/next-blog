import { ObjectId } from "@/db";

const file = {} as File;
file.lastModified;
file.name;
file.size;
file.type;

export const Blog = {
  title: {
    type: String,
  },
  slug: {
    type: String,
    default: "",
  },
  path: {
    type: String,
    unique: true,
  },
  lastModified: {
    type: Number,
  },
  size: {
    type: Number,
  },
  type: {
    type: String,
  },
  accessId: {
    type: ObjectId,
  },
  relationshipId: {
    type: ObjectId,
  },
};

export const option = {
  timestamps: true,
};
