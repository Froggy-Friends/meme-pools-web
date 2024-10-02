"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChain } from "@/context/chain";
import Logo from "@/components/Logo";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  const { chain } = useChain();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[100vh]">
      <Logo height={100} width={100} />
      <h1 className="my-5 text-3xl">User not found</h1>
      <button
        className="hover:bg-gray active:scale-95 bg-dark-gray py-2 px-4 border-[1px] border-white/20 rounded-3xl transition"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => router.push(`/${chain.name}`)
        }
      >
        Return home
      </button>
    </main>
  );
}
