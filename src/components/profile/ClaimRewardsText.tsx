"use client";

import Link from "next/link";
import useFrogBalance from "@/hooks/useFrogBalance";
import { Address } from "viem";

type ClaimRewardsTextProps = {
  address: Address;
};

export default function ClaimRewardsText({ address }: ClaimRewardsTextProps) {
  const frogBalance = useFrogBalance(address);

  return (

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-2xl mb-1">Claim Rewards</p>
          <p className="text-sm laptop:text-base max-w-[75%] tablet:max-w-[70%] laptop:max-w-[60%] ml-[0.125rem]">
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

        <div className="text-center justify-self-center mr-4 tablet:mr-8">
          <p className="text-xl text-primary">HOLDING</p>
          <p>{frogBalance || 0} FROGS</p>
        </div>
      </div>
  );
}
