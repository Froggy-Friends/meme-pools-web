"use client";

import Link from "next/link";
import useFrogBalance from "@/hooks/useFrogBalance";
import { Address } from "viem";
import { Chain } from "@/models/chain";
import useApesBalance from "@/hooks/useApesBalance";

type ClaimRewardsTextProps = {
  addresses: Address[];
  chain: Chain;
};

export default function ClaimRewardsText({ addresses, chain }: ClaimRewardsTextProps) {
  const frogBalance = useFrogBalance(addresses, chain);
  const { totalApesBalance } = useApesBalance(addresses);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4 tablet:mb-[10px]">
        <p className="text-2xl">Claim Rewards</p>
        {chain === Chain.ApeChain ? (
          <p className="text-sm text-center bg-cream text-dark px-4 tablet:py-1 mr-5 tablet:mr-7 rounded-3xl font-proximaNovaBold tablet:w-[100px]">
            {totalApesBalance || 0} {totalApesBalance === 1 ? "Asset" : "Assets"}
          </p>
        ) : (
          <p className="text-sm text-center bg-cream text-dark px-4 tablet:py-1 mr-5 tablet:mr-7 rounded-3xl font-proximaNovaBold tablet:w-[100px]">
            {frogBalance || 0} {frogBalance === 1 ? "Frog" : "Frogs"}
          </p>
        )}
      </div>

      {chain === Chain.ApeChain ? (
        <p className="text-sm desktop:text-base max-w-[97%] tablet:max-w-[60%] ml-[0.125rem]">
          Claim up to 2,000 tokens per{" "}
          <Link
            href="https://opensea.io/collection/boredapeyachtclub"
            className="text-[#61A14C] hover:text-green transition"
            target="_blank"
          >
            Bayc
          </Link>{" "}
          and 500 tokens per{" "}
          <Link
            href="https://opensea.io/collection/mutant-ape-yacht-club"
            className="text-[#61A14C] hover:text-green transition"
            target="_blank"
          >
            Mayc
          </Link>{" "}
          you own, for each coin successfully launched on Meme Pools.
        </p>
      ) : (
        <p className="text-sm desktop:text-base max-w-[97%] tablet:max-w-[60%] ml-[0.125rem]">
          Claim up to 2,250 tokens per{" "}
          <Link
            href="https://opensea.io/collection/froggyfriendsnft"
            className="text-[#61A14C] hover:text-green transition"
            target="_blank"
          >
            frog
          </Link>{" "}
          you own, for each coin successfully launched on Meme Pools.
        </p>
      )}
    </div>
  );
}
