import { etherscanUrl } from "@/config/env";
import { TxStatus } from "@/types/token/types";
import { Modal, ModalContent, ModalBody, CircularProgress } from "@nextui-org/react";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import { formatAddress } from "@/lib/formatAddress";
import Image from "next/image";

type CreateCoinPendingModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  txStatus: TxStatus;
  txHash: string | null;
  ticker: string;
  tokenImage: string | null;
};

export default function CreateCoinPendingModal({
  isOpen,
  onOpenChange,
  txStatus,
  txHash,
  ticker,
  tokenImage,
}: CreateCoinPendingModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xl"
      className="bg-dark text-white w-[500px] h-[300px] laptop:h-[325px] p-6"
      isDismissable={txStatus === "completed"}
      hideCloseButton={txStatus !== "completed"}
    >
      <ModalContent>
        <ModalBody className="flex flex-col justify-center items-center gap-[4rem]">
          {txStatus === "idle" || txStatus === "pending" ? (
            <CircularProgress
              classNames={{
                svg: "w-24 h-24 drop-shadow-md",
                indicator: "stroke-primary",
                track: "stroke-dark-gray",
                value: "text-3xl font-semibold text-white",
              }}
              strokeWidth={2}
            />
          ) : txStatus === "completed" ? (
            <FaCheckCircle size={100} className="text-primary" />
          ) : null}

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-1">
              <p className="text-lg mr-1">{txStatus === "completed" ? "Created" : "Creating"}</p>
              {tokenImage && (
                <Image
                  src={tokenImage}
                  alt="token image"
                  width={20}
                  height={20}
                  className="rounded-full h-5 w-5 object-cover"
                />
              )}
              <p className="text-lg">${ticker.toUpperCase()}</p>
            </div>

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
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
