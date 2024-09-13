import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";

type SlippageModalForm = {
  slippagePercent: number;
  priorityFee: number;
};

type SlippageModalCloseCallback = ({
  slippagePercent,
  priorityFee,
}: SlippageModalForm) => void;

type SlippageModalProps = {
  isOpen: boolean;
  onClose: SlippageModalCloseCallback;
};

export default function SlippageModal({ isOpen, onClose }: SlippageModalProps) {
  const { register, handleSubmit, getValues } = useForm<SlippageModalForm>();

  return (
    <Modal
      isOpen={isOpen}
      closeButton={<></>}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose(getValues());
      }}
    >
      <ModalContent className="bg-gray-950/90">
        <form onSubmit={handleSubmit(onClose)}>
          <ModalBody>
            <div className="flex flex-col gap-1">
              <label htmlFor="max-slippage" className="text-white mb-1">
                Set max slippage (%)
              </label>
              <input
                type="number"
                {...register("slippagePercent")}
                className="w-full border border-white rounded-md bg-transparent p-2 placeholder-neutral-400 text-sm focus:ring-white focus:ring-1 focus:outline-none text-white"
              />
              <span className="text-neutral-400 text-xs">
                This is the maximum amount of slippage you are willing to accept
                when placing trades
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="max-slippage" className="text-white mb-1">
                Priority fee
              </label>
              <input
                type="number"
                {...register("priorityFee")}
                className="w-full border border-white rounded-md bg-transparent p-2 placeholder-neutral-400 text-sm focus:ring-white focus:ring-1 focus:outline-none text-white"
              />
              <span className="text-neutral-400 text-xs">
                A higher priority fee will make your transactions confirm
                faster. This is the transaction fee that you pay to the Eth
                network on each trade.
              </span>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="default" variant="solid">
              Close
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
