"use server";

import { redirect } from "next/navigation";

export async function login(form: FormData) {
  try {
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    // const user = Model.login(email, password);
  } catch (error) {
    throw error;
  }
  // replace("/");
  redirect("/");
}

export async function register(form: FormData) {
  try {
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    // const user = Model.register(email, password);
  } catch (error) {
    throw error;
  }
  redirect("/");
}
