import { Model } from "../index.mjs";

export async function login(email: string, password: string) {
  const user = await Model.User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.password !== password) {
    throw new Error("Password is incorrect");
  }
  return user;
}

export async function register(email: string, password: string) {
  const user = await Model.User.findOne({ email });
  if (user) {
    throw new Error("User already exists");
  }
  const newUser = await Model.User.insertMany([{ email, password }]);
  return newUser[0];
}
