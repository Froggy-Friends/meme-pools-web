import Image from "next/image";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import { IoMdArrowRoundForward } from "react-icons/io";
import { formatNumber } from "@/lib/format";

type SwapModalProps = {
  fromImageUrl: string;
  fromAmount: string;
  fromTicker: string;
  toImageUrl: string;
  toAmount: string;
  toTicker: string;
  isOpen: boolean;
  onOpenChange: () => void;
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
}: SwapModalProps) {
  return (
    <Modal className="h-[420px] bg-dark-gray text-white p-4" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalBody className="flex flex-col justify-center items-center gap-8">
          <Spinner color="success" />
          <div className="text-large">
            <span className="text-green">Confirming</span>
            <span> Swap</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Image className="w-[18px] h-[18px] rounded-3xl" src={fromImageUrl} alt="eth" width={18} height={18} />
              <p>{parseFloat(fromAmount).toFixed(5)}</p>
              <p>{fromTicker}</p>
            </div>
            <IoMdArrowRoundForward />
            <div className="flex items-center gap-1">
              <Image className="w-[18px] h-[18px] rounded-3xl" src={toImageUrl} alt="eth" width={18} height={18} />
              <p>{formatNumber(Number(toAmount))}</p>
              <p>{toTicker}</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-center">
          <p className="text-light-gray">Proceed in your wallet</p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
