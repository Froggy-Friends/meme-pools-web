import Image from "next/image";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import { IoMdArrowRoundForward } from "react-icons/io";
import { formatNumber } from "@/lib/format";
import { TxStatus } from "@/types/token/types";
import Link from "next/link";
import { formatAddress } from "@/lib/formatAddress";
import { etherscanUrl } from "@/config/env";
import { BsArrowUpCircleFill } from "react-icons/bs";

type SwapModalProps = {
  fromImageUrl: string;
  fromAmount: string;
  fromTicker: string;
  toImageUrl: string;
  toAmount: string;
  toTicker: string;
  isOpen: boolean;
  onOpenChange: () => void;
  txStatus: TxStatus;
  txHash: string | null;
};

export default function SwapModal({
  fromImageUrl,
  fromAmount,
  fromTicker,
  toImageUrl,
  toAmount,
  toTicker,
  isOpen,
  onOpenChange,
  txStatus,
  txHash,
}: SwapModalProps) {
  return (
    <Modal className="h-[420px] bg-dark-gray text-white p-4" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalBody className="flex flex-col justify-center items-center gap-8">
          {txStatus === "idle" ? <Spinner color="success" /> : <BsArrowUpCircleFill size={45} className="text-green" />}
          <div className="text-large">
            <span className="text-green">
              {txStatus === "idle" ? "Confirming" : txStatus === "pending" ? "Submitted" : "Completed"}
            </span>
            <span> Swap</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Image className="w-[18px] h-[18px] rounded-3xl" src={fromImageUrl} alt="eth" width={18} height={18} />
              <p>{fromAmount}</p>
              <p>{fromTicker}</p>
            </div>
            <IoMdArrowRoundForward />
            <div className="flex items-center gap-1">
              <Image className="w-[18px] h-[18px] rounded-3xl" src={toImageUrl} alt="eth" width={18} height={18} />
              <p>{toAmount}</p>
              <p>{toTicker}</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-center">
          <p className="text-light-gray">
            {txHash ? (
              <>
                See confirmation{" "}
                <Link href={`${etherscanUrl}/tx/${txHash}`} target="_blank">
                  <span className="text-light-gray hover:text-cream transition">{formatAddress(txHash)}</span>
                </Link>
              </>
            ) : (
              "Proceed in your wallet"
            )}
          </p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
