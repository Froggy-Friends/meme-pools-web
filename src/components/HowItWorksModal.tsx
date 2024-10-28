"use client";

import { bondingCurveLimit, bondingCurveReward } from "@/config/token";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useRouter } from "next/navigation";

type HowItWorkdsModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export default function HowItWorksModal({ isOpen, onOpenChange }: HowItWorkdsModalProps) {
  const router = useRouter();

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
            <p>Memepools is making memecoins fun again</p>
            <p>Every coing launched on Memepools has:</p>
            <ul className="list-disc pl-4">
              <li>Fair launch</li>
              <li>No presale</li>
              <li>No team allocation</li>
            </ul>
            <p>
              When a token reaches a <span className="text-blue">{bondingCurveLimit}</span> market cap, all remaining
              tokens are deposited into Raydium/Uniswap and you are rewarded{" "}
              <span className="text-primary">{bondingCurveReward}</span>
            </p>
          </ModalBody>
          <ModalFooter className="flex justify-center">
            <button
              onClick={() => router.push("/create")}
              className="bg-primary rounded-3xl h-10 w-[400px] mt-20 text-dark-gray text-xl font-proximaSoftBold hover:bg-primary/80 active:scale-[0.98] transition"
            >
              CREATE TOKEN
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
