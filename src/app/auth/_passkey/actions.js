'use server';

import { deleteCredential, updateCredentialName } from '@/app/_data/credentials';
import { revalidatePath } from 'next/cache';

export async function updateName(new_name, credential_id) {
	try {
		await updateCredentialName(new_name, credential_id);
		revalidatePath('/');
		return { newName: new_name };
	} catch (e) {
		console.error(e);
		return {
			error: e.message || 'Unexpected Error Occurred',
			timestamp: new Date().getTime(),
		};
	}
}

export async function deleteCred(credential_id) {
	try{
		await deleteCredential(credential_id);
		revalidatePath('/');
		return;
	} catch(e){
		console.error(e);
		return {
			error: e.message || 'Unexpected Error Occurred',
			timestamp: new Date().getTime(),
		};
	}
}