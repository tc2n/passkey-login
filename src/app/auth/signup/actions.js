"use server";

import { bcrypt } from "bcrypt";
import { getFormData } from "@/utils/getFormData";
import { SignupFormSchema } from "./definifition";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { redirect } from "next/dist/server/api-utils";

export async function signup(state, formData) {
  // 1. Validate fields
  const validationResult = SignupFormSchema.safeParse(getFormData(formData));
  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      payload: formData,
    };
  }
  const { name, email, password } = validationResult.data;

  // 2. Create User
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.insert(usersTable).values({ name, email, password: hashedPassword });

  // 3. Create Session
  // Not Creating Session
  redirect("/login");
}
