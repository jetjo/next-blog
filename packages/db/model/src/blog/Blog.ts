import { pick } from "lodash-es";
import { ObjectId } from "@db/driver/index.js";
import { IBlogDoc, IBLog } from ".";

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
  keywords: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  links: {
    type: Array,
    default: [],
  },
  // 任意级别的类目, 类目之间的关系由其他表维护, 此处意图存储最细致级别的类目
  CategoryId: {
    type: ObjectId
  },
  // path: {
  //   type: String,
  //   unique: true,
  // },
  readingTime: {
    // 阅读此文章💲时长, 不带单位, 单位分钟
    type: String,
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
  // 索引评论及热度信息
  accessId: {
    type: ObjectId,
    unique: false,
    ref: "BlogAccess",
  },
  // 索引所属关系
  relationshipId: {
    type: ObjectId,
  },
  // 作者
  authorId: {
    type: ObjectId,
    unique: false,
    ref: "User",
  },
  // 作者名,邮箱
  author: {
    type: String,
  },
  tags: {
    type: Array,
    default: []
  }
} as const;

export const option = {
  timestamps: true,
};

const fields = Object.keys(Blog)

export function toBlog(doc: IBlogDoc) {
  const _res: any = pick(doc, fields)
  _res._id = String(doc._id)
  _res.links = [...doc.links]
  _res.tags = [...doc.tags ?? []]
  // @ts-ignore
  _res.date = String(doc['updatedAt'])
  return _res as IBLog & { date: string };
}