"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChain } from "@/context/chain";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  const { chain } = useChain();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="text-center min-h-[100vh]">
      <h1 className="mb-5 text-3xl pt-40">User not found</h1>
      <button
        className="hover:bg-gray active:scale-95 bg-dark-gray py-2 px-4 border-[1px] border-white/20 rounded-3xl"
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
