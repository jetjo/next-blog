import { SchemaCtor, ModelGen_ } from "./schema-helper.mjs";
import { option as userOption, User } from "./auth/User.mjs";

// export { toUser } from "./auth/User.mjs";

export const UserModel = ModelGen_("User", new SchemaCtor(User, userOption), null as unknown as (keyof typeof User))
export type IUserDoc = typeof UserModel.doc;
export type IUser = typeof UserModel.pojo;
