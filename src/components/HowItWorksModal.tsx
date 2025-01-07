"use client";

import useMarketcapGoal from "@/hooks/useMarketcapGoal";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import RewardTier from "./create/RewardTier";
import useEthPrice from "@/hooks/useEthPrice";
import Link from "next/link";
import { contractAddress } from "@/config/env";
import { getTierTwoReward, getTierThreeReward } from "@/lib/chains";
import { getTierOneReward } from "@/lib/chains";
import { useChain } from "@/context/chain";
import { Chain } from "@/models/chain";
import { apeChainReward } from "@/config/token";
import useApePrice from "@/hooks/useApePrice";

type HowItWorkdsModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export default function HowItWorksModal({ isOpen, onOpenChange }: HowItWorkdsModalProps) {
  const router = useRouter();
  const ethPrice = useEthPrice();
  const apePrice = useApePrice();
  const { chain } = useChain();
  const marketcapGoal = useMarketcapGoal(contractAddress, chain.name);
  const tierOneReward = Math.round(getTierOneReward(chain.name) * ethPrice);
  const tierTwoReward = Math.round(getTierTwoReward(chain.name) * ethPrice);
  const tierThreeReward = Math.round(getTierThreeReward(chain.name) * ethPrice);
  const apeReward = Math.round(apeChainReward * apePrice);

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
            {chain.name === Chain.ApeChain ? (
              <p>
                When a coin reaches a <span className="text-green">${marketcapGoal}</span> market cap, it will be
                automatically launched and the creator will be sent their{" "}
                <span className="text-gold">${apeReward}</span> reward onchain.
              </p>
            ) : (
              <p>
                When a coin reaches a <span className="text-green">${marketcapGoal}</span> market cap, launch it on your
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
                to earn exclusive silver and gold tier rewards.
              </p>
            )}

            {chain.name === Chain.ApeChain ? (
              <p className="mb-4">
                Two percent of all coins that graduate from Meme Pools are available to claim as an exclusive reward for{" "}
                <Link
                  href="https://opensea.io/collection/boredapeyachtclub"
                  className="text-primary hover:text-light-primary transition"
                  target="_blank"
                >
                  Bayc
                </Link>{" "}
                holders. One percent will be available to claim as an exclusive reward for{" "}
                <Link
                  href="https://opensea.io/collection/mutant-ape-yacht-club"
                  className="text-primary hover:text-light-primary transition"
                  target="_blank"
                >
                  Mayc
                </Link>{" "}
                holders.
              </p>
            ) : (
              <p>
                One percent of all coins that graduate from Meme Pools are available to claim as an exclusive reward for
                Frog owners.
              </p>
            )}

            {chain.name !== Chain.ApeChain && (
              <div className="flex items-center justify-center gap-x-6 my-10">
                <RewardTier tier="bronze" rewardAmount={tierOneReward} />
                <RewardTier tier="silver" rewardAmount={tierTwoReward} />
                <RewardTier tier="gold" rewardAmount={tierThreeReward} />
              </div>
            )}
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
