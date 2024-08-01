"use client";

import { useRouter } from "next/navigation";

export default function LaunchCoinButton() {
  const router = useRouter();

  return (
    <button
      className="w-[14rem] mx-auto text-xl border-[1px] border-black rounded-lg py-2 px-3"
      onClick={() => router.push("/launch")}
    >
      Launch a new coin
    </button>
  );
}
