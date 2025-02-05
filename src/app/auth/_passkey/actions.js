'use server';

import { deleteCredential, getCredentialById, updateCredentialLastUsed, updateCredentialName } from '@/app/_data/credentials';
import { getUserById } from '@/app/_data/user';
import { createSession, getTempSession, setTempSession } from '@/app/_lib/session';
import { CONFIG } from '@/config';
import { generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

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
	try {
		await deleteCredential(credential_id);
		revalidatePath('/');
		return;
	} catch (e) {
		console.error(e);
		return {
			error: e.message || 'Unexpected Error Occurred',
			timestamp: new Date().getTime(),
		};
	}
}

export async function signInRequest() {
	try {
		const options = await generateAuthenticationOptions({
			rpID: CONFIG.hostname,
			allowCredentials: [],
			userVerification: 'preferred',
		});

		(await cookies()).delete('temp');
		// Keep the challenge value in session
		await setTempSession({ challenge: options.challenge });
		return options;
	} catch (e) {
		console.error(e);
		return {
			error: e.message || 'Unexpected Error Occurred',
		};
	}
}

export async function signInResponse(response) {
	// Retrieve the challenge from the session
	const { challenge: expectedChallenge } = await getTempSession();
	const expectedOrigin = CONFIG.associatedOrigins;
	const expectedRPID = CONFIG.hostname;
	let userId;

	try {
		// Find the matching credential from the credential ID
		const cred = await getCredentialById(response.id);
		if (!cred) {
			(await cookies()).delete('temp');
			throw new Error('Matching Credential not found. Try signing in with a password');
		}

		// Find the matching user from the user ID  contianed in the credential
		const user = await getUserById(cred.user_id);
		if (!user) {
			throw new Error('User not found');
		}

		// Decode ArrayBuffers and construct and authenticator object
		const credential = {
			id: cred.id,
			publicKey: isoBase64URL.toBuffer(cred.publicKey),
			transports: cred.transports,
		};

		const verification = await verifyAuthenticationResponse({
			response,
			expectedChallenge,
			expectedOrigin,
			expectedRPID,
			credential,
			requireUserVerification: false,
		});

		const { verified, authenticationInfo } = verification;

		//If Authentication Fails
		if (!verified) {
			throw new Error('User Verification Failed');
		}

		//Update Last used Timestamp
		await updateCredentialLastUsed(cred.id);

		// Delete Challange from memory
		(await cookies()).delete('temp');

		userId = cred.user_id;
	} catch (e) {
		(await cookies()).delete('temp');
		return {
			error: e.message || 'Unexpected Error Occurred',
		};
	}

	if (userId) {
		await createSession(userId);
	}
}
