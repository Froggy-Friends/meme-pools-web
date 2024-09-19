"use client";

import { useRouter } from "next/navigation";
import { IoMdArrowDropleft } from "react-icons/io";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      className="flex items-center justify-center bg-dark-gray border-[0.25px] border-white/[5%] w-10 h-8 rounded-3xl text-small hover:bg-gray active:scale-[0.97] transition"
      onClick={() => router.back()}
    >
      <IoMdArrowDropleft size={24} />
    </button>
  );
}
