'use client';

export async function isWebAuthnSupported() {
	// Availability of `window.PublicKeyCredential` means WebAuthn is usable.
	// `isUserVerifyingPlatformAuthenticatorAvailable` means the feature detection is usable.
	// `​​isConditionalMediationAvailable` means the feature detection is usable.
	if (typeof window !== 'undefined' && window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable && PublicKeyCredential.isConditionalMediationAvailable) {
		// Check if user verifying platform authenticator is available.
		try {
			const results = await Promise.all([PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(), PublicKeyCredential.isConditionalMediationAvailable()]);
			if (results.every(r => r === true)) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			console.log(e);
			return false;
		}
	}
	return false;
}

export async function isPublicKeyCredentialSupported() {
	if (typeof window !== 'undefined' && window.PublicKeyCredential) {
		return true;
	}
	return false;
}

export async function isConditionalUISupported() {
	// Availability of `window.PublicKeyCredential` means WebAuthn is usable.  
if (typeof window !== 'undefined' && window.PublicKeyCredential &&  
    PublicKeyCredential.isConditionalMediationAvailable) {  
  // Check if conditional mediation is available.  
  const isCMA = await PublicKeyCredential.isConditionalMediationAvailable();  
  if (isCMA) {  
    // Call WebAuthn authentication  
	return true;
  }
}  
return false;
}
