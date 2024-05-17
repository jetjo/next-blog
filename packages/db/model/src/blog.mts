

import { SchemaCtor, ModelGen_ } from "./schema-helper.mjs";

import { option as commentOption, Comment } from "./blog/Comment.mjs";
import { option as mdxContentOption, MDXContent } from './blog/MDXContentRaw.mjs';
import { option as blogOption, Blog } from "./blog/Blog.mjs";
import { option as codeBlockOption, CodeBlock } from "./blog/CodeBlocks.mjs";
import { option as blogAccessOption, BlogAccess } from "./blog/BlogAccess.mjs";
import { option as headingOption, Heading } from "./blog/Headings.mjs";
import { option as searchIndexOption, SearchIndex } from "./blog/SearchIndex.mjs";

// export { toComment } from "./blog/Comment.mjs";
export { toMDXContent } from './blog/MDXContentRaw.mjs';
export { toBlog } from "./blog/Blog.mjs";
export { toCodeBlock } from "./blog/CodeBlocks.mjs";
// export { toBlogAccess } from "./blog/BlogAccess.mjs";
export { toHeading } from "./blog/Headings.mjs";
export { toSearchIndex } from "./blog/SearchIndex.mjs";

export const BlogModel = ModelGen_("Blog", new SchemaCtor(Blog, blogOption), null as unknown as (keyof typeof Blog))
export type IBlogDoc = typeof BlogModel.doc;
export type IBLog = typeof BlogModel.pojo;


export const MDXContentModel = ModelGen_("MDXContent", new SchemaCtor(MDXContent, mdxContentOption), null as unknown as (keyof typeof MDXContent))
export type IMDXContentDoc = typeof MDXContentModel.doc;
export type IMDXContent = typeof MDXContentModel.pojo;


export const CodeBlockModel = ModelGen_("CodeBlock", new SchemaCtor(CodeBlock, codeBlockOption), null as unknown as (keyof typeof CodeBlock))
export type ICodeBlockDoc = typeof CodeBlockModel.doc;
export type ICodeBlock = typeof CodeBlockModel.pojo;


export const CommentModel = ModelGen_("Comment", new SchemaCtor(Comment, commentOption), null as unknown as (keyof typeof Comment))
export type ICommentDoc = typeof CommentModel.doc;
export type IComment = typeof CommentModel.pojo;


export const BlogAccessModel = ModelGen_("BlogAccess", new SchemaCtor(BlogAccess, blogAccessOption), null as unknown as (keyof typeof BlogAccess))
export type IBlogAccessDoc = typeof BlogAccessModel.doc;
export type IBlogAccess = typeof BlogAccessModel.pojo;


export const HeadingModel = ModelGen_("Heading", new SchemaCtor(Heading, headingOption), null as unknown as (keyof typeof Heading))
export type IHeadingDoc = typeof HeadingModel.doc;
export type IHeading = typeof HeadingModel.pojo;


export const SearchIndexModel = ModelGen_("SearchIndex", new SchemaCtor(SearchIndex, searchIndexOption), null as unknown as (keyof typeof SearchIndex))
export type ISearchIndexDoc = typeof SearchIndexModel.doc;
export type ISearchIndex = typeof SearchIndexModel.pojo;


/** @private Model Type Helper */
// function mth<T extends Schema>(schema: T) {
//   return db.model("", schema)
// }

// type MTH<T extends Schema> = ReturnType<typeof mth<T>>


/** @private Model Type Helper */
// function dth<T extends Schema>(schema: T) {
//   return mth(schema).findById('');
// }

// export type DTH<T extends Schema> = Awaited<ReturnType<typeof dth<T>>>
