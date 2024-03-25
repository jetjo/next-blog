import { db, dbOption } from "../db";

import { option as userOption, User } from "./User";
import { Model as BlogModel } from "./blog";

const UserSchema = new db.Schema(User, userOption);
const UserModel = db.models.User || db.model("User", UserSchema);

export const Model = {
  User: UserModel,
  ...BlogModel,
};
