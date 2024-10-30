"use client";

import AnimationToggle from "./AnimationToggle";
import NSFWToggle from "./NSFWToggle";
import { useRouter } from "next/navigation";

export default function TokenDisplayControls() {
  const router = useRouter();

  return (
    <section>
      <div className="flex gap-x-3 pb-4">
        <button>Following</button>
        <button>Terminal</button>
        <button>For You</button>
      </div>

      <div className="flex gap-x-2">
        <button
          onClick={() => router.push("/?sortBy=new&page=1")}
          className="p-2 border border-black rounded-xl"
        >
          New
        </button>
        <button
          onClick={() => router.push("/?sortBy=trending&page=1")}
          className="p-2 border border-black rounded-xl"
        >
          Trending
        </button>
        <button
          onClick={() => router.push("/?sortBy=transactions&page=1")}
          className="p-2 border border-black rounded-xl"
        >
          Top Txs
        </button>
        <button
          onClick={() => router.push("/?sortBy=volume&page=1")}
          className="p-2 border border-black rounded-xl"
        >
          Top Volume
        </button>
        <div className="flex flex-col">
          <AnimationToggle />
          <NSFWToggle />
        </div>
      </div>
    </section>
  );
}