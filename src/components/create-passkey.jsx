'use client'

import { isWebAuthnSupported } from "@/utils/isWebAuthnSupported";
import Image from "next/image";
import { useEffect, useState } from "react";

export function CreatePasskey() {
    const [showPasskey, setShowPasskey] = useState(false);
    useEffect(() => {
        getPasskeySupport();
        async function getPasskeySupport() {
            const isSupported = await isWebAuthnSupported();
            setShowPasskey(isSupported);
            console.log(isSupported);
        }
    }, [])
    return (
        <>
            {
                showPasskey &&
                <button
                    className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    rel="noopener noreferrer"
                >
                    <Image
                        className="dark:invert"
                        src="/vercel.svg"
                        alt="Vercel logomark"
                        width={20}
                        height={20}
                    />
                    Create New Passkey
                </button>
            }
        </>
    )
}