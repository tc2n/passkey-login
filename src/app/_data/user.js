import { db } from '@/db';
import { verifySession } from '../_lib/session';
import { usersTable } from '@/db/schema';
import { cache } from 'react';
import { eq } from 'drizzle-orm';

export const getUser = cache(async () => {
	const session = await verifySession();
	const data = await db.select({ id: usersTable.id, name: usersTable.name, email: usersTable.email }).from(usersTable).where(eq(usersTable.id, session.userId));
	return data[0];
});

export const getUserById = cache(async id => {
	const data = await db.select({ name: usersTable.name, email: usersTable.email }).from(usersTable).where(eq(usersTable.id, id));
	return data[0];
});
