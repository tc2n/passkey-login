import { credentialsTable } from '@/db/schema';
import { verifySession } from '../_lib/session';
import { db } from '@/db';
import { eq, sql } from 'drizzle-orm';

export const getUserCredentials = async () => {
	const session = await verifySession();
	const data = await db.select().from(credentialsTable).where(eq(credentialsTable.user_id, session.userId));
	return data;
};

export const getCredentialById = async id => {
	const data = await db.select().from(credentialsTable).where(eq(credentialsTable.id, id));
	return data[0];
};

export const updateCredential = async credential => {
	await db.update(credentialsTable).set(credential).where(eq(credentialsTable.id, credential.id));
};

export const updateCredentialName = async (newName, id) => {
	await db.update(credentialsTable).set({ name: newName }).where(eq(credentialsTable.id, id));
};

export const updateCredentialLastUsed = async id => {
	await db
		.update(credentialsTable)
		.set({ last_used: sql`NOW()` })
		.where(eq(credentialsTable.id, id));
};

export const insertCredential = async credential => {
	await db.insert(credentialsTable).values(credential);
};

export const deleteCredential = async id => {
	await db.delete(credentialsTable).where(eq(credentialsTable.id, id));
};
