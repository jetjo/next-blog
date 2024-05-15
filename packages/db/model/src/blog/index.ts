import type { Schema } from "mongoose";
import { db, dbOption } from "@db/driver/index.js";

import { option as commentOption, Comment } from "./Comment";
import { option as mdxContentOption, MDXContent } from './MDXContentRaw';
import { option as blogOption, Blog } from "./Blog";
import { option as codeBlockOption, CodeBlock } from "./CodeBlocks";
import { option as blogAccessOption, BlogAccess } from "./BlogAccess";
import { option as headingOption, Heading } from "./Headings";

const _GLOBAL = globalThis as unknown as GlobalNode;

_GLOBAL.db_models = _GLOBAL.db.models;

export const BlogSchema = new db.Schema(Blog, blogOption);
export type IBlogDoc = NonNullable<DTH<typeof BlogSchema>>;
const BlogModel: MTH<typeof BlogSchema> = _GLOBAL.db_models.Blog = _GLOBAL.db_models.Blog || db.model("Blog", BlogSchema);
export type IBLog = {
  [key in keyof (typeof Blog)]: IBlogDoc[key];
} & IModel;


export const MDXContentSchema = new db.Schema(MDXContent, mdxContentOption);
export type IMDXContentDoc = NonNullable<DTH<typeof MDXContentSchema>>;
// index.js:618 Uncaught Error: Cannot overwrite `Blog` model once compiled.
const MDXContentModel: MTH<typeof MDXContentSchema> = _GLOBAL.db_models.MDXContent =
  _GLOBAL.db_models.MDXContent || db.model("MDXContent", MDXContentSchema);
export type IMDXContent = {
  [key in keyof (typeof MDXContent)]: IMDXContentDoc[key];
} & IModel


export const CodeBlockSchema = new db.Schema(CodeBlock, codeBlockOption);
export type ICodeBlockDoc = NonNullable<DTH<typeof CodeBlockSchema>>;
const CodeBlockModel: MTH<typeof CodeBlockSchema> = _GLOBAL.db_models.CodeBlock = _GLOBAL.db_models.CodeBlock || db.model("CodeBlock", CodeBlockSchema);
export type ICodeBlock = {
  [key in keyof (typeof CodeBlock)]: ICodeBlockDoc[key];
} & IModel;


export const CommentSchema = new db.Schema(Comment, commentOption);
const CommentModel: MTH<typeof CommentSchema> = _GLOBAL.db_models.Comment = _GLOBAL.db_models.Comment || db.model("Comment", CommentSchema);

export const BlogAccessSchema = new db.Schema(BlogAccess, blogAccessOption);
const BlogAccessModel: MTH<typeof BlogAccessSchema> = _GLOBAL.db_models.BlogAccess =
  _GLOBAL.db_models.BlogAccess || db.model("BlogAccess", BlogAccessSchema);

export const HeadingSchema = new db.Schema(Heading, headingOption);
export type IHeadingDoc = NonNullable<DTH<typeof HeadingSchema>>;
const HeadingModel: MTH<typeof HeadingSchema> = _GLOBAL.db_models.HeadingModel =
  _GLOBAL.db_models.HeadingModel || db.model("heading", HeadingSchema);
export type IHeading = {
  [key in keyof (typeof Heading)]: IHeadingDoc[key];
} & IModel

export const Model = {
  Blog: BlogModel,
  MDXContent: MDXContentModel,
  CodeBlock: CodeBlockModel,
  Comment: CommentModel,
  BlogAccess: BlogAccessModel,
  Heading: HeadingModel
} as const;

/** @private Model Type Helper */
function mth<T extends Schema>(schema: T) {
  return db.model("", schema)
}

type MTH<T extends Schema> = ReturnType<typeof mth<T>>


/** @private Model Type Helper */
function dth<T extends Schema>(schema: T) {
  return mth(schema).findById('');
}

export type DTH<T extends Schema> = Awaited<ReturnType<typeof dth<T>>>

export type IModel = {
  readonly _id: string
  readonly date?: string
}