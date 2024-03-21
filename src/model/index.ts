import { db } from "../db";

import { option as userOption, User } from "./User";
import { option as commentOption, Comment } from "./Comment";
import { option as MDXContentOption, MDXContent } from "./MDXContentRaw";
import { option as blogOption, Blog } from "./Blog";

const BlogSchema = new db.Schema(Blog, blogOption);
const BlogModel = db.models.Blog || db.model("Blog", BlogSchema);

const MDXContentSchema = new db.Schema(MDXContent, MDXContentOption);
// index.js:618 Uncaught Error: Cannot overwrite `Blog` model once compiled.
const MDXContentModel =
  db.models.MDXContent || db.model("MDXContent", MDXContentSchema);

const UserSchema = new db.Schema(User, userOption);
const UserModel = db.models.User || db.model("User", UserSchema);

const CommentSchema = new db.Schema(Comment, commentOption);
const CommentModel = db.models.Comment || db.model("Comment", CommentSchema);

export const Model = {
  Blog: BlogModel,
  MDXContent: MDXContentModel,
  User: UserModel,
  Comment: CommentModel,
};
