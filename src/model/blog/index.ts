import { db, dbOption } from "../../db";

import { option as commentOption, Comment } from "./Comment";
import { option as MDXContentOption, MDXContent } from "./MDXContentRaw";
import { option as blogOption, Blog } from "./Blog";
import { option as blogAccessOption, BlogAccess } from "./BlogAccess";

const BlogSchema = new db.Schema(Blog, blogOption);
const BlogModel = db.models.Blog || db.model("Blog", BlogSchema);

const MDXContentSchema = new db.Schema(MDXContent, MDXContentOption);
// index.js:618 Uncaught Error: Cannot overwrite `Blog` model once compiled.
const MDXContentModel =
  db.models.MDXContent || db.model("MDXContent", MDXContentSchema);

const CommentSchema = new db.Schema(Comment, commentOption);
const CommentModel = db.models.Comment || db.model("Comment", CommentSchema);

const BlogAccessSchema = new db.Schema(BlogAccess, blogAccessOption);
const BlogAccessModel =
  db.models.BlogAccess || db.model("BlogAccess", BlogAccessSchema);

export const Model = {
  Blog: BlogModel,
  MDXContent: MDXContentModel,
  Comment: CommentModel,
  BlogAccess: BlogAccessModel,
};
