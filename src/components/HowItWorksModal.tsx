"use client";

import useMarketcapGoal from "@/hooks/useMarketcapGoal";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import RewardTier from "./create/RewardTier";
import { tierOneEthReward, tierThreeEthReward, tierTwoEthReward } from "@/lib/constants";
import useEthPrice from "@/hooks/useEthPrice";
import Link from "next/link";

type HowItWorkdsModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export default function HowItWorksModal({ isOpen, onOpenChange }: HowItWorkdsModalProps) {
  const router = useRouter();
  const marketcapGoal = useMarketcapGoal();
  const ethPrice = useEthPrice();
  const tierOneReward = Math.round(tierOneEthReward * ethPrice);
  const tierTwoReward = Math.round(tierTwoEthReward * ethPrice);
  const tierThreeReward = Math.round(tierThreeEthReward * ethPrice);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="bg-dark-gray text-white p-4 tablet:p-6 max-w-[600px] overflow-hidden"
        placement="top-center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <p className="text-xl">How It Works</p>
          </ModalHeader>
          <ModalBody>
            <p>Every coin launched on Meme Pools has:</p>
            <ul className="list-disc pl-4">
              <li>Fair launch</li>
              <li>No presale</li>
              <li>No team allocation</li>
            </ul>
            <p>
              When a coin reaches a <span className="text-green">${marketcapGoal}</span> market cap, launch it on your
              profile to collect your reward. All users start with bronze rewards. Own{" "}
              <Link
                href="https://magiceden.us/collections/ethereum/0x7ad05c1b87e93be306a9eadf80ea60d7648f1b6f"
                className="text-[#61A14C] hover:text-green transition"
                target="_blank"
              >
                Frogs
              </Link>{" "}
              to earn exclusive silver and gold tier rewards.
            </p>

            <p>
              One percent of all coins that graduate from Meme Pools are available to claim as an exclusive reward for
              Frog owners.
            </p>

            <div className="flex items-center justify-center gap-x-6 my-10">
              <RewardTier tier="bronze" rewardAmount={tierOneReward} />
              <RewardTier tier="silver" rewardAmount={tierTwoReward} />
              <RewardTier tier="gold" rewardAmount={tierThreeReward} />
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center">
            <button
              onClick={() => router.push("/create")}
              className="bg-primary rounded-xl h-10 w-[400px] text-dark-gray text-xl font-proximaNovaBold hover:bg-light-primary active:scale-[0.98] transition"
            >
              CREATE COIN
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
