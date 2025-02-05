'use server';

import { getUserCredentials, insertCredential } from '@/app/_data/credentials';
import { getUser } from '@/app/_data/user';
import { getTempSession, setTempSession } from '@/app/_lib/session';
import { CONFIG } from '@/config';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { cookies, headers } from 'next/headers';
import { userAgent } from 'next/server';

const aaguids = [];

export async function registerRequest() {
	const user = await getUser();
	try {
		// Create 'excludeCredentials' from a list of stored credentials
		const excludeCredentials = [];
		const credentials = await getUserCredentials();
		for (const credential of credentials) {
			excludeCredentials.push({
				id: credential.id,
				type: 'public-key',
				transports: credential.transports,
			});
		}

		// Set authenticatorSelection
		const authenticatorSelection = {
			authenticatorAttachment: 'platform',
			requireResidentKey: true,
		};
		const attestationType = 'none';

		const options = await generateRegistrationOptions({
			rpName: CONFIG.rpName,
			rpID: CONFIG.hostname,
			userID: isoBase64URL.toBuffer(user.id),
			userName: user.email,
			userDisplayName: user.name,
			// Prompt users for additional information about the authenticator
			attestationType,
			// Prevent users from re-registering the same authenticators
			excludeCredentials,
			authenticatorSelection,
		});

		// Keep the challange value in a session
		await setTempSession({ challenge: options.challenge });

		// Respond with registration options to the client
		return options;
	} catch (e) {
		console.error(e);
		return {
			error: e.message || 'Unexpected Error Occurred',
		};
	}
}

export async function registerResponse(credential) {
	// Retrieve the challenge from the session
	const { challenge: expectedChallenge } = await getTempSession();
	const expectedOrigin = CONFIG.associatedOrigins;
	const expectedRPID = CONFIG.hostname;

	// Validate the credential
	try {
		const verification = await verifyRegistrationResponse({
			response: credential,
			expectedChallenge,
			expectedOrigin,
			expectedRPID,
			requireUserVerification: false,
		});
		const { verified, registrationInfo } = verification;

		// If verification failed
		if (!verified) {
			throw new Error('User verification failed');
		}

		const { publicKey: credentialPublicKey, id: credentialID } = registrationInfo.credential;

		const { aaguid = '00000000-0000-0000-000000000000', credentialDeviceType } = registrationInfo;

		// BASE64URL encode ArrayBuffers.
		const base64PublicKey = isoBase64URL.fromBuffer(credentialPublicKey);

		const user = await getUser();
		const headerList = await headers();
		const userAgentStructure = { headers: headerList };
		const { device, browser, os } = userAgent(userAgentStructure);

		// Determine the name of the authenticator from the AAGUID
		const name = (Object.keys(CONFIG.aaguids).length > 0 && CONFIG.aaguids[aaguid]?.name) || `${device.model}, ${browser.name}:${browser.version}, ${os.name}:${os.version}`;

		// Store the registration information
		await insertCredential({
			id: credentialID,
			publicKey: base64PublicKey,
			name,
			transports: credential.response.transports || [],
			aaguid,
			be: credentialDeviceType === 'multiDevice',
			user_id: user.id,
		});
		(await cookies()).delete('temp');
	} catch (e) {
		console.error(e);
		return {
			error: e.message || 'Unexpected Error Occurred',
		};
	}
}
