"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import rocket from "../../public/rocket.svg";
import { useChain } from "@/context/chain";

export default function LaunchCoinButton() {
  const router = useRouter();
  const { chain } = useChain();

  return (
    <section className="relative w-56 h-72 flex flex-col items-center justify-center gap-y-10 bg-dark-gray rounded-xl">
      <Image src={rocket} alt="rocket" className="mt-10" />

      <button
        className="text-2xl text-dark px-6 py-3 font-proximaSoftBold bg-green rounded-full hover:bg-green/80 active:scale-[0.98]"
        onClick={() => router.push(`${chain}/launch`)}
      >
        LAUNCH
      </button>
    </section>
  );
}
