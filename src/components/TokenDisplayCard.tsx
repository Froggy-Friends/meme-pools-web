"use client";

import { useChain } from "@/context/chain";
import { TokenWithCreator } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type TokenDisplayCardProps = {
  token: TokenWithCreator;
};

export default function TokenDisplayCard({ token }: TokenDisplayCardProps) {
  const { chain } = useChain();

  return (
    <div className="flex flex-grow-0 flex-shrink-0 w-[20%]">
      <Link
        href={`${chain}/token/${token.tokenAddress}`}
        className="flex flex-col"
      >
        <div className="w-[12.5rem] h-32 relative">
          <Image
            src={token.image}
            alt="token-image"
            fill={true}
            className="rounded-lg"
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-x-2">
            {token.creator && (
              <Image
                src={token.creator.imageUrl!}
                alt="creator avatar"
                height={30}
                width={30}
                className="rounded-full"
              />
            )}

            <p>${token.ticker}</p>
          </div>

          <div className="flex gap-x-2 text-light-green">
            <p>${token.marketCap}</p>
            <p>MC</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
