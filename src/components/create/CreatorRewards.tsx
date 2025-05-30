"use client";

import Link from "next/link";
import RewardTier from "./RewardTier";
import useEthPrice from "@/hooks/useEthPrice";
import useMarketcapGoal from "@/hooks/useMarketcapGoal";
import { contractAddress } from "@/config/env";
import { Chain } from "@/models/chain";
import { useChain } from "@/context/chain";
import { getTierOneReward, getTierThreeReward, getTierTwoReward } from "@/lib/chains";

export default function CreatorRewards() {
  const ethPrice = useEthPrice();
  const { chain } = useChain();
  const marketcapGoal = useMarketcapGoal(contractAddress, chain.name);
  const tierOneReward = Math.round(getTierOneReward(chain.name) * ethPrice);
  const tierTwoReward = Math.round(getTierTwoReward(chain.name) * ethPrice);
  const tierThreeReward = Math.round(getTierThreeReward(chain.name) * ethPrice);

  return (
    <section className="flex flex-col items-center laptop:flex-row justify-between gap-y-6 laptop:gap-y-0 bg-dark-gray rounded-xl mx-2 tablet:mx-0 px-4 laptop:px-6 py-7 laptop:w-full desktop:w-[950px] desktop:mx-auto mt-20 text-center laptop:text-left">
      <div className="flex flex-col items-center laptop:items-start gap-y-4 laptop:gap-y-0">
        <h3 className="text-2xl pb-2">Creator Rewards</h3>
        <p className="laptop:hidden tablet:max-w-[94%]">
          Once your coin hits a <span className="text-green">${marketcapGoal}</span> market cap, launch it on your
          profile to collect your reward. All users start with bronze rewards. Own
          {chain.name === Chain.Base && (
            <span>
              {" "}
              <Link
                href={"https://opensea.io/collection/tadpolesnft"}
                className="text-primary hover:text-light-primary transition"
                target="_blank"
              >
                Tadpoles
              </Link>{" "}
              and
            </span>
          )}{" "}
          <Link
            href="https://opensea.io/collection/froggyfriendsnft"
            className="text-[#61A14C] hover:text-green transition"
            target="_blank"
          >
            Frogs
          </Link>{" "}
          to earn silver and gold tier rewards.
        </p>
        <p className="hidden laptop:block max-w-[72%] desktop:max-w-[65%] text-sm">
          Once your coin hits a <span className="text-green">${marketcapGoal}</span> market cap, launch it on your
          profile to collect your reward. All users start with bronze rewards.
        </p>
        <p className="hidden laptop:block max-w-[72%] desktop:max-w-[65%] text-sm">
          Own
          {chain.name === Chain.Base && (
            <span>
              {" "}
              <Link
                href={"https://magiceden.io/collections/base/0x0afcae1208ac99addc6983a06735a199f190de09"}
                className="text-primary hover:text-light-primary transition"
                target="_blank"
              >
                Tadpoles
              </Link>{" "}
              and
            </span>
          )}{" "}
          <Link
            href="https://magiceden.us/collections/ethereum/0x7ad05c1b87e93be306a9eadf80ea60d7648f1b6f"
            className="text-[#61A14C] hover:text-green transition"
            target="_blank"
          >
            Frogs
          </Link>{" "}
          to earn exclusive silver and gold tier rewards.
        </p>
      </div>

      <div className="flex items-center gap-x-5 laptop:w-[47%] desktop:w-[40%] laptop:justify-end">
        <RewardTier tier="bronze" rewardAmount={tierOneReward} />
        <RewardTier tier="silver" rewardAmount={tierTwoReward} />
        <RewardTier tier="gold" rewardAmount={tierThreeReward} />
      </div>
    </section>
  );
}
