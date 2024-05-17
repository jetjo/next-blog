import type { IModel } from "./schema-helper.mjs";
import { UserModel } from "./auth.mjs";

export async function login(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.password !== password) {
    throw new Error("Password is incorrect");
  }
  return user;
}

export async function register(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (user) {
    throw new Error("User already exists");
  }
  const newUser = await UserModel.insertMany([{ email, password }]);
  return newUser[0];
}
