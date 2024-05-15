import { pick } from "lodash-es";
import { ObjectId } from "@db/driver/index.mjs";
import { IMDXContentDoc, IMDXContent } from "./index.mjs";

export const MDXContent = {
  content: {
    type: String,
  },
  rawContent: {
    type: String,
  },
  // 通过插件提取的文章的目录
  toc: {
    type: String,
  },
  blogId: {
    type: ObjectId,
    unique: true,
    ref: "Blog",
  },
} as const;

export const option = {
  timestamps: true,
};

const fields = Object.keys(MDXContent)

export function toMDXContent(doc: IMDXContentDoc) {
  const _res: any = pick(doc, fields)
  _res._id = String(doc._id)
  _res.blogId = String(doc.blogId)
  return _res as IMDXContent;
}
