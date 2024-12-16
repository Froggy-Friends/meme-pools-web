"use client";

import Image from "next/image";
import { Token } from "@prisma/client";
import CollectionSocials from "./CollectionSocials";
import { Address } from "viem";
import useUser from "@/hooks/useUser";
import useIsAHolder from "@/hooks/useIsAHolder";
import { TokenOrigin, TokenType } from "@/models/token";
import useTokenBalance from "@/hooks/useTokenBalance";
import { wagmiChains } from "@/config/reown";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";

type CollectionInfoProps = {
  token: Token;
  setIsVisible: (isVisible: boolean) => void;
};

export default function CollectionInfo({ token, setIsVisible }: CollectionInfoProps) {
  const { currentUser } = useUser();
  const { isConnected } = useAccount();
  const { isHolder } = useIsAHolder(
    token.tokenAddress as Address,
    currentUser?.ethAddress as Address,
    token.type as TokenType
  );
  const { tokenBalance } = useTokenBalance(token.tokenAddress as Address, wagmiChains.eth.id);
  const disabled = useMemo(() => {
    if (!isConnected) return true;
    if (token.origin === TokenOrigin.Internal) {
      if (!tokenBalance) return true;
    } else if (token.origin === TokenOrigin.External) {
      if (!isHolder) return true;
    }
  }, [token.origin, tokenBalance, isHolder, isConnected]);

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
          <Link
            href={token.origin === TokenOrigin.Internal ? `/${token.chain}/token/${token.tokenAddress}` : ""}
            className={`text-xl tablet:text-3xl laptop:text-5xl max-w-[130px] tablet:max-w-[350px] laptop:max-w-[500px] desktop:max-w-[750px] truncate ${
              token.origin === TokenOrigin.External ? "cursor-default" : "cursor-pointer"
            }`}
          >
            {token.name}
          </Link>
        </div>

        <div className="flex gap-x-4 items-center">
          <button
            disabled={disabled}
            onClick={() => setIsVisible(true)}
            className="hidden tablet:block bg-primary text-black font-proximaNovaBold px-4 py-0.5 rounded-xl hover:bg-light-primary active:scale-[0.98] disabled:bg-gray disabled:cursor-not-allowed transition"
          >
            Post Meme
          </button>
          <CollectionSocials token={token} />
        </div>
      </div>

      <button
        disabled={disabled}
        onClick={() => setIsVisible(true)}
        className="tablet:hidden w-[125px] self-end bg-primary text-black text-sm font-proximaNovaBold px-4 py-0.5 rounded-xl hover:bg-light-primary active:scale-[0.98] disabled:bg-gray disabled:cursor-not-allowed transition"
      >
        Post Meme
      </button>
    </section>
  );
}
