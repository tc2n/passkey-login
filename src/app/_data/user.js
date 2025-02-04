import { db } from "@/db";
import { verifySession } from "../_lib/session";
import { usersTable } from "@/db/schema";
import { cache } from "react";

export const getUser = cache(async () => {
  const session = await verifySession();

  const data = await db.select({name: usersTable.name, email: usersTable.email }).from(usersTable).where(eq(usersTable.id, session.userId));
  return data[0];
});
