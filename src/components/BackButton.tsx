"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      className="bg-dark-gray border-[0.25px] border-white/[5%] w-[65px] h-[35px] rounded-3xl px-3 py-2 mt-10 mb-6 text-small hover:bg-gray active:scale-[0.97] transition"
      onClick={() => router.back()}
    >
      Back
    </button>
  );
}
