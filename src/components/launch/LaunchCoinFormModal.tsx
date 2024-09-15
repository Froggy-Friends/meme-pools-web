import { toTitleCase } from "@/lib/toTitleCase";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { UseFormRegister, UseFormResetField } from "react-hook-form";
import { LaunchFormValues } from "./LaunchCoinForm";
import { LaunchModalInputs } from "@/types/launch/types";
import { IoMdCloseCircle } from "react-icons/io";

type LaunchCoinFormModalProps = {
  name: LaunchModalInputs;
  register: UseFormRegister<LaunchFormValues>;
  resetField: UseFormResetField<LaunchFormValues>;
  pattern?: string;
};

export default function LaunchCoinFormModal({
  name,
  pattern,
  register,
  resetField,
}: LaunchCoinFormModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const inputStyles =
    "h-10 w-[450px] px-2 mb-5 rounded-lg outline-none bg-dark-gray focus:ring-2 ring-gray";
  return (
    <>
      <button
        className="h-20 w-40 bg-dark-gray rounded-lg m-auto text-lg hover:bg-gray transition"
        onClick={onOpen}
        type="button"
      >
        {toTitleCase(name)}
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
        className="bg-dark text-white w-[700px] h-[500px] p-3"
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-between">
                <label htmlFor={name} className="mb-1 text-xl">
                  Add {toTitleCase(name)} Link
                </label>
                <IoMdCloseCircle height={25} width={25} />
              </ModalHeader>
              <ModalBody>
                <input
                  id={name}
                  type="url"
                  pattern={pattern}
                  placeholder="https://"
                  className={inputStyles}
                  autoComplete="off"
                  {...register(name)}
                />
              </ModalBody>
              <ModalFooter className="justify-center gap-x-2 mb-2">
                <button
                  onClick={onClose}
                  className="bg-green h-10 w-48 rounded-3xl text-lg text-dark font-proximaSoftBold hover:bg-[#29ff93] transition"
                >
                  SAVE
                </button>
                <button
                  onClick={() => {
                    resetField(name);
                    onClose();
                  }}
                  className="bg-cream/80 h-10 w-48 rounded-3xl text-lg text-dark font-proximaSoftBold hover:bg-cream transition"
                >
                  CANCEL
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
