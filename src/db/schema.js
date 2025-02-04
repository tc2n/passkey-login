import { date, foreignKey, int, json, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  dob: date(),
});

/**
 * Creadentials data schema
 * {
 *   id: string Base64URL encoded CredentialID,
 *   publicKey: string Base64URL encoded PublicKey,
 *   name: string name of the credential,
 *   transports: an array of transports,
 *   registered: timestamp,
 *   last_used: timestamp,
 *   user_id: string Base64URL encoded user ID of the owner,
 * }
 **/

export const credentialsTable = mysqlTable(
  "credentials",
  {
    id: int().autoincrement().primaryKey(),
    publicKey: varchar({ length: 255 }),
    name: varchar({ length: 255 }),
    transports: json(),
    registered: timestamp().defaultNow(),
    last_used: timestamp(),
    user_id: int(),
  },
  (table) => {
    return {
      userReference: foreignKey({
        columns: [table.user_id],
        foreignColumns: [usersTable.id],
        name: "credential_user",
      }),
    };
  }
);
