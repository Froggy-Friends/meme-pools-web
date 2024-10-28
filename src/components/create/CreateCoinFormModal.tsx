import { toTitleCase } from "@/lib/toTitleCase";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { UseFormRegister, UseFormResetField } from "react-hook-form";
import { CreateFormValues } from "./CreateCoinForm";
import { CreateModalInputs } from "@/types/create/types";
import { IoMdCloseCircle } from "react-icons/io";

type CreateCoinFormModalProps = {
  name: CreateModalInputs;
  register: UseFormRegister<CreateFormValues>;
  resetField: UseFormResetField<CreateFormValues>;
  pattern?: string;
};

export default function CreateCoinFormModal({ name, pattern, register, resetField }: CreateCoinFormModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const inputStyles =
    "h-10 max-w-[340px] tablet:min-w-[500px] tablet:w-[500px] px-2 mb-5 rounded-lg outline-none bg-dark-gray focus:ring-2 ring-gray";
  return (
    <>
      <button
        className="h-10 tablet:h-20 min-w-[70px] max-w-[75px] tablet:min-w-32 tablet:w-32 laptop:min-w-40 laptop:w-40 bg-dark-gray rounded-lg m-auto text-sm tablet:text-lg hover:bg-gray transition"
        onClick={onOpen}
        type="button"
      >
        {toTitleCase(name)}
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
        className="bg-dark text-white w-[700px] h-[350px] laptop:h-[400px] p-3"
        hideCloseButton={true}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex justify-between">
                <label htmlFor={name} className="mb-1 text-xl">
                  Add {toTitleCase(name)} Link
                </label>
                <button onClick={onClose}>
                  <IoMdCloseCircle height={25} width={25} />
                </button>
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
              <ModalFooter className="flex-col laptop:flex-row justify-center gap-x-2 mb-2">
                <button
                  onClick={onClose}
                  className="bg-primary h-10 w-full laptop:w-48 rounded-3xl text-lg text-dark font-allumiBold hover:bg-[#29ff93] transition"
                >
                  SAVE
                </button>
                <button
                  onClick={() => {
                    resetField(name);
                    onClose();
                  }}
                  className="bg-cream/80 h-10 w-full laptop:w-48 rounded-3xl text-lg text-dark font-allumiBold hover:bg-cream transition"
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
