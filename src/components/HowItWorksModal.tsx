"use client";

import { bondingCurveLimit, bondingCurveReward } from "@/config/token";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

type HowItWorkdsModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export default function HowItWorksModal({ isOpen, onOpenChange }: HowItWorkdsModalProps) {
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
            <p>
              <span className="text-green">Frog</span>.fun is making memecoins fun again
            </p>
            <p>
              Every coing launced on <span>Frog</span>.fun has:
            </p>
            <ul className="list-disc pl-4">
              <li>Fair launch</li>
              <li>No presale</li>
              <li>No team allocation</li>
            </ul>
            <p>
              When a token reaches a <span className="text-blue">{bondingCurveLimit}</span> market cap, all remaining
              tokens are deposited into Raydium/Uniswap and you are rewarded{" "}
              <span className="text-green">{bondingCurveReward}</span>
            </p>
          </ModalBody>
          <ModalFooter className="flex justify-center">
            <button className="bg-green rounded-3xl h-12 w-[400px] mt-20 text-dark-gray text-xl font-proximaSoftBold hover:bg-green/80 active:scale-[0.98] transition">
              LAUNCH TOKEN
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
