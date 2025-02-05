'use client';

import { toast } from '@/hooks/use-toast';
import { deleteCred, signInRequest, signInResponse } from './actions';
import { registerRequest, registerResponse } from './register';
import { WebAuthnAbortService } from '@/lib/webAuthnAbortService';
import { CONFIG } from '@/config';

let controller;

export async function registerCredential() {
	if (typeof window === 'undefined') return;

	if (controller) controller.abort();
	controller = new AbortController();

	//Fetch passkey Creation options from the server
	const _options = await registerRequest();
	if (_options?.error) {
		throw new Error(_options.error);
	}

	// Base64URL decode some values
	const options = PublicKeyCredential.parseCreationOptionsFromJSON(_options);

	// Use platform authenticator and discoverable credential
	options.authenticatorSelection = {
		authenticatorAttachment: 'platform',
		requireResidentKey: true,
	};

	// Invoke the authenticator to create the credential
	const cred = await navigator.credentials.create({ publicKey: options, signal: controller.signal });
	const credential = cred.toJSON();

	// Send the credential to the server for registration
	try {
		const result = registerResponse(credential);
		if (result?.error) {
			throw new Error(result.error);
		}
		return result;
	} catch (e) {
		// Detect if Credential was not found
		if (PublicKeyCredential.signalUnknownCredential) {
			await PublicKeyCredential.signalUnknownCredential({
				rpId: options.rp.id,
				credentialId: credential.id,
			});
			console.info('The passkey failed to register has been signaled to the password manager.');
		}
		if (e.name === 'InvalidStateError') {
			throw new Error('A passkey already exists for this device.');
		} else if (e.name === 'NotAllowedError') {
			// User cancelled the request;
			return;
		} else {
			console.error(e);
			throw e;
		}
	}
}

export async function authenticateUser(conditional = false) {
	if (typeof window === 'undefined') return;

	// Fetch passkey request optins from the server
	const _options = await signInRequest();

	if (_options?.error) {
		throw new Error(_options.error);
	}

	const options = PublicKeyCredential.parseRequestOptionsFromJSON(_options);

	// allowCredentials empty array invokes an account selector by discoverable credentials.
	options.allowCredentials = [];

	// Invoke Webauthn get
	const cred = await navigator.credentials.get({
		publicKey: options,
		// Request a Conditional UI
		mediation: conditional ? 'conditional' : 'optional',
		signal: WebAuthnAbortService.createNewAbortSignal(),
	});

	const credential = cred.toJSON();

	try {
		// Send the result to the server
		const result = await signInResponse(credential);
		if (result?.error) {
			throw new Error(result.error);
		}
		return result;
	} catch (e) {
		if (e.status === 404 && PublicKeyCredential.signalUnknownCredential) {
			await PublicKeyCredential.signalUnknownCredential({
				rpId: options.rpId,
				credentialId: credential.id,
			})
				.then(() => {
					console.info('Passkey Associated with Credential not found and have been signaled to the password manager');
				})
				.catch(e => {
					console.error(e.message);
				});
		}
		if (e.message !== 'NEXT_REDIRECT') {
			toast({
				variant: 'destructive',
				title: 'Error Logging in Using Passkey',
				description: e.message || 'Please try using password',
			});
		}
	}
}

export async function deleteCredential(credentialId) {
	if (typeof window === 'undefined') return;
	const res = await deleteCred(credentialId);
	if (res?.error) {
		throw new Error(res.error);
	}
	await PublicKeyCredential.signalUnknownCredential({
		rpId: CONFIG.hostname,
		credentialId,
	});
}
