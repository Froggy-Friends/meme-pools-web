"use client";

import Image from "next/image";
import { Token } from "@prisma/client";
import CollectionSocials from "./CollectionSocials";
import useTokenBalance from "@/hooks/useTokenBalance";
import { Address } from "viem";
import { wagmiChains } from "@/config/reown";

type CollectionInfoProps = {
  token: Token;
  setIsVisible: (isVisible: boolean) => void;
};

export default function CollectionInfo({ token, setIsVisible }: CollectionInfoProps) {
  const { tokenBalance } = useTokenBalance(token.tokenAddress as Address, wagmiChains.eth.id);
  
  return (
    <section className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex gap-x-2 tablet:gap-x-4 items-center">
          <Image
            src={token.image}
            alt="collection-image"
            width={50}
            height={50}
            className="rounded-full h-[50px] w-[50px] object-cover"
          />
          <p className="text-3xl laptop:text-5xl max-w-[130px] tablet:max-w-none truncate">{token.name}</p>
        </div>

        <div className="flex gap-x-4 items-center">
          <button
            onClick={() => setIsVisible(true)}
            className="hidden tablet:block bg-primary text-black font-proximaNovaBold px-4 py-0.5 rounded-xl hover:bg-light-primary active:scale-[0.98] transition"
          >
            Post Meme
          </button>
          <CollectionSocials token={token} />
        </div>
      </div>

      <button
        onClick={() => setIsVisible(true)}
        className="tablet:hidden w-[125px] self-end bg-primary text-black text-sm font-proximaNovaBold mr-1 px-4 py-0.5 rounded-xl hover:bg-light-primary active:scale-[0.98] transition"
      >
        Post Meme
      </button>
    </section>
  );
}
