"use server";

import { createSession, deleteSession } from "@/app/_lib/session";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { getFormData } from "@/utils/getFormData";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { timestamp } from "drizzle-orm/mysql-core";

export async function login(state, formData) {
  // 1. Validate fields
  const { email, password } = getFormData(formData);
  console.log("here", email, password);
  let user;
  try {
    const users = await db
      .select({
        id: usersTable.id,
        password: usersTable.password,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    user = users[0];
    if (!user) {
      throw new Error("User not found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid Password");
    }
  } catch (e) {
    console.log(e);
    return {
      error: e.message || "Unexpected Error Occurred",
      timestamp: (new Date()).getTime()
    };
  }
  // 3. Create Session
  if (user) {
    await createSession(user.id);
  }
}

export async function Logout() {
  await deleteSession();
}
