import { db, dbOption } from "@db/driver/index.mjs";

import { option as userOption, User } from "./User.mjs";
import { Model as BlogModel } from "./blog/index.mjs";

const UserSchema = new db.Schema(User, userOption);
const UserModel = db.models.User || db.model("User", UserSchema);

export const Model = {
  User: UserModel,
  ...BlogModel,
};
