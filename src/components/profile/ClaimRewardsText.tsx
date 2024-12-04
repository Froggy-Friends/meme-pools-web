"use client";

import Link from "next/link";
import useFrogBalance from "@/hooks/useFrogBalance";
import { Address } from "viem";

type ClaimRewardsTextProps = {
  addresses: Address[];
};

export default function ClaimRewardsText({ addresses }: ClaimRewardsTextProps) {
  const frogBalance = useFrogBalance(addresses);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4 tablet:mb-[10px]">
        <p className="text-2xl">Claim Rewards</p>
        <p className="text-sm text-center bg-cream text-dark px-4 tablet:py-1 mr-5 tablet:mr-7 rounded-3xl font-proximaNovaBold tablet:w-[100px]">
          {frogBalance || 0} Frogs
        </p>
      </div>

      <p className="text-sm desktop:text-base max-w-[97%] tablet:max-w-[60%] ml-[0.125rem]">
        Claim up to 2,250 tokens per{" "}
        <Link
          href="https://magiceden.us/collections/ethereum/0x7ad05c1b87e93be306a9eadf80ea60d7648f1b6f"
          className="text-[#61A14C] hover:text-green transition"
          target="_blank"
        >
          frog
        </Link>{" "}
        you own, for each coin successfully launched on Meme Pools.
      </p>
    </div>
  );
}
