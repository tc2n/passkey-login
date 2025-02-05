'use client';

import { registerCredential } from '@/app/auth/_passkey/client';
import { useToast } from '@/hooks/use-toast';
import { isWebAuthnSupported } from '@/utils/isWebAuthnSupported';
import { Fingerprint } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export function CreatePasskey() {
  const [showPasskey, setShowPasskey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    getPasskeySupport();
    async function getPasskeySupport() {
      const isSupported = await isWebAuthnSupported();
      setShowPasskey(isSupported);
      console.log(isSupported);
    }
  }, []);

  const handleRegisterCredential = useCallback(async () => {
    try {
      setIsLoading(true);
      await registerCredential();
      toast({
        description: 'Passkey Created Successfully',
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        description: e.message || 'Something Went Wrong',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {showPasskey && (
        <button
          className='rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5'
          rel='noopener noreferrer'
          onClick={handleRegisterCredential}
          disabled={isLoading}
        >
          <Fingerprint />
          Create New Passkey
        </button>
      )}
    </>
  );
}
