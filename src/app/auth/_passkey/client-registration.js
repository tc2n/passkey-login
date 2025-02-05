'use client';

import { RegisterRequest, registerResponse } from './register';

export async function registerCredential() {
  if (typeof window === 'undefined') return;

  //Fetch passkey Creation options from the server
  const _options = await RegisterRequest();

  // Base64URL decode some values
  const options = PublicKeyCredential.parseCreationOptionsFromJSON(_options);

  // Use platform authenticator and discoverable credential
  options.authenticatorSelection = {
    authenticatorAttachment: 'platform',
    requireResidentKey: true,
  };

  // Invoke the authenticator to create the credential
  const cred = await navigator.credentials.create({ publicKey: options });
  const credential = cred.toJSON();

  // Send the credential to the server for registration
  try {
    const result = registerResponse(credential);
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
