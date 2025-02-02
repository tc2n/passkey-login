"use server";

import { createSession } from "@/app/_lib/session";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { getFormData } from "@/utils/getFormData";
import bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function login(state, formData) {
  // 1. Validate fields
  const { email, password } = getFormData(formData);
  console.log("here", email, password);
  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        password: usersTable.password,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (!user) {
      throw new Error("User not found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid Password");
    }
    // 3. Create Session
    await createSession(user.id);
  } catch (e) {
    console.log(e);
    return {
      error: e.message || "Unexpected Error Occurred",
    };
  }

}
