import Image from "next/image";
import { CircularProgress, Modal, ModalBody, ModalContent, ModalFooter } from "@nextui-org/react";
import { IoMdArrowRoundForward, IoMdArrowRoundDown } from "react-icons/io";
import { TxStatus } from "@/types/token/types";
import Link from "next/link";
import { formatAddress } from "@/lib/formatAddress";
import { etherscanUrl } from "@/config/env";
import { FaCheckCircle } from "react-icons/fa";
import { formatTicker } from "@/lib/formatTicker";
import { TradingTab } from "./Swap";

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
  approveTxHash: string | null;
  isApproved: boolean;
  approveTxStatus: TxStatus;
  handleSwapModalClose: () => void;
  activeTab: TradingTab;
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
  approveTxHash,
  isApproved,
  approveTxStatus,
  handleSwapModalClose,
  activeTab,
}: SwapModalProps) {
  return (
    <Modal
      className="h-[420px] bg-dark-gray text-white p-4"
      isOpen={isOpen}
      onOpenChange={open => {
        onOpenChange();
        if (!open) {
          handleSwapModalClose();
        }
      }}
    >
      <ModalContent>
        <ModalBody className="flex flex-col justify-center items-center gap-8">
          <div className="flex gap-x-8 items-center">
            <div className="flex flex-col items-center gap-y-8">
              {txStatus === "idle" ||
              txStatus === "pending" ||
              approveTxStatus === "pending" ||
              (approveTxStatus === "idle" && !isApproved) ? (
                <CircularProgress
                  classNames={{
                    svg: "w-24 h-24 drop-shadow-md",
                    indicator: "stroke-primary",
                    track: "stroke-dark-gray",
                    value: "text-3xl font-semibold text-white",
                  }}
                  strokeWidth={2}
                />
              ) : (
                <FaCheckCircle size={100} className="text-primary" />
              )}
              <div className="text-large flex items-center gap-x-1">
                {activeTab === TradingTab.BUY && (
                  <span className="text-primary">
                    {txStatus === "completed" && approveTxStatus !== "completed" && !isApproved ? "Approval" : "Buy"}
                  </span>
                )}
                {activeTab === TradingTab.SELL && (
                  <span className="text-primary">
                    {txStatus === "completed" && approveTxStatus !== "completed" && !isApproved ? "Approval" : "Sell"}
                  </span>
                )}
                <span>
                  {txStatus === "idle" ||
                  txStatus === "pending" ||
                  approveTxStatus === "pending" ||
                  (approveTxStatus === "idle" && !isApproved)
                    ? "Pending"
                    : "Complete"}
                </span>
              </div>
            </div>
          </div>
          {approveTxStatus !== "pending" && approveTxStatus !== "completed" && (
            <div className="flex flex-col gap-y-2 items-start">
              <div className="flex flex-col items-center gap-4 ">
                <div className="flex items-center gap-1">
                  <Image
                    className="w-[18px] h-[18px] rounded-3xl"
                    src={fromImageUrl}
                    alt="eth"
                    width={18}
                    height={18}
                  />
                  <p>{fromAmount}</p>
                  <p>${formatTicker(fromTicker)}</p>
                </div>
                <IoMdArrowRoundDown className="text-xl" />
                <div className="flex items-center gap-1">
                  <Image className="w-[18px] h-[18px] rounded-3xl" src={toImageUrl} alt="eth" width={18} height={18} />
                  <p>{toAmount}</p>
                  <p>${formatTicker(toTicker)}</p>
                </div>
              </div>
            </div>
          )}
          {approveTxStatus !== "idle" &&
            approveTxStatus !== "error" &&
            txStatus !== "pending" &&
            txStatus !== "idle" && (
              <div className="flex flex-col gap-y-2 items-start">
                <div className="flex gap-x-2 items-center justify-between">
                  <FaCheckCircle size={25} className="text-primary" />
                  <p>
                    {toAmount} ${formatTicker(toTicker)} {activeTab === TradingTab.BUY ? "Buy" : "Sell"} Complete
                  </p>
                </div>
                {approveTxStatus === "completed" && (
                  <div className="flex gap-x-2 justify-between">
                    <FaCheckCircle size={25} className="text-primary" />
                    <p>Approval Complete</p>
                  </div>
                )}
              </div>
            )}
        </ModalBody>
        <ModalFooter className="flex justify-center">
          <p className="text-light-gray">
            {txHash && approveTxStatus !== "pending" && approveTxStatus !== "completed" ? (
              <>
                See confirmation{" "}
                <Link href={`${etherscanUrl}/tx/${txHash}`} target="_blank">
                  <span className="text-light-gray hover:text-cream transition">{formatAddress(txHash)}</span>
                </Link>
              </>
            ) : approveTxHash ? (
              <>
                See confirmation{" "}
                <Link href={`${etherscanUrl}/tx/${approveTxHash}`} target="_blank">
                  <span className="text-light-gray hover:text-cream transition">{formatAddress(approveTxHash)}</span>
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
