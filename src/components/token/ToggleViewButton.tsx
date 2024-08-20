"use client";

import { useRouter } from "next/navigation";

type ToggleViewButtonProps = {
  name: string;
  tokenAddress: string;
};

export default function ToggleViewButton({
  name,
  tokenAddress,
}: ToggleViewButtonProps) {
  const router = useRouter();
  return (
    <button
      onClick={() =>
        router.push(`/token/${tokenAddress}?view=${name.toLowerCase()}`)
      }
      className="bg-gray-950/90 rounded-lg p-2 text-white hover:bg-gray-950/80"
    >
      {name}
    </button>
  );
}
