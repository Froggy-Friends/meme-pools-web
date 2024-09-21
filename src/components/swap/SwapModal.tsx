import Image from "next/image";
import { Modal, ModalBody, ModalContent, ModalFooter, Spinner } from "@nextui-org/react";
import { IoMdArrowRoundForward } from "react-icons/io";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { formatNumber } from "@/lib/format";

type SwapModalProps = {
  fromImageUrl: string;
  fromAmount: string;
  fromTicker: string;
  toImageUrl: string;
  toAmount: string;
  toTicker: string;
  isPending: boolean;
  isSuccess: boolean;
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
  isPending,
  isSuccess,
  isOpen,
  onOpenChange,
}: SwapModalProps) {
  return (
    <Modal className="h-[420px] bg-dark-gray text-white p-4" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalBody className="flex flex-col justify-center items-center gap-8">
          {isPending && <Spinner color="success" />}
          {isPending && (
            <div className="text-large font-bold">
              <span className="text-green">Confirm</span>
              <span> Trade</span>
            </div>
          )}
          {isSuccess && <RiCheckboxCircleFill color="#00DA6C" size={50} />}
          {isSuccess && (
            <div className="text-large font-bold">
              <p className="text-light-gray">Trade Placed</p>
            </div>
          )}
          <div className={`flex items-center gap-2 ${isSuccess && "opacity-50"}`}>
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
          {isPending && <p className="text-light-gray">Confirm in your wallet</p>}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
