"use server";

import bcrypt from "bcryptjs";
import { getFormData } from "@/utils/getFormData";
import { SignupFormSchema } from "./definifition";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { redirect } from "next/navigation";

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
  try {
    await db.insert(usersTable).values({ name, email, password: hashedPassword });
  } catch (e){
    if(e.code=== 'ER_DUP_ENTRY') {
      return {
        error: "Account with this email already exists"
      }
    } else {
      return {
        error: "Some Error occurred"
      }
    }
  }

  // 3. Create Session
  // Not Creating Session
  redirect("/auth/login?from-signup=true");
  // return {
  //   success: true
  // }
}
