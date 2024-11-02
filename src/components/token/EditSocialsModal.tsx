"use client";

import { updateTokenSocials } from "@/actions/token/actions";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import FormSubmitButton from "../FormSubmitButton";
import { Token } from "@prisma/client";
import { useChain } from "@/context/chain";
import { revalidatePath } from "next/cache";
import * as Sentry from "@sentry/nextjs";

type EditSocialsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  token: Token;
};

export default function EditSocialsModal({ isOpen, onClose, token }: EditSocialsModalProps) {
  const { chain } = useChain();
  const handleSubmit = async (formData: FormData) => {
    try {
      await updateTokenSocials(token, formData);
      toast.success("Social links updated");
      revalidatePath(`/${chain.name}/token/${token.tokenAddress}`);
      onClose();
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to update social links");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="bg-dark">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-2 mt-4">Social Links</ModalHeader>
            <ModalBody>
              <form action={handleSubmit}>
                <div className="flex flex-col gap-1 mb-2">
                  <label htmlFor="twitter">Twitter</label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    placeholder="https://"
                    className="bg-dark-gray rounded-lg p-2 outline-none focus:ring-2 ring-gray"
                    autoComplete="off"
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label htmlFor="telegram">Telegram</label>
                  <input
                    type="text"
                    id="telegram"
                    name="telegram"
                    placeholder="https://"
                    className="bg-dark-gray rounded-lg p-2 outline-none focus:ring-2 ring-gray"
                    autoComplete="off"
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label htmlFor="discord">Discord</label>
                  <input
                    type="text"
                    id="discord"
                    name="discord"
                    placeholder="https://"
                    className="bg-dark-gray rounded-lg p-2 outline-none focus:ring-2 ring-gray"
                    autoComplete="off"
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    placeholder="https://"
                    className="bg-dark-gray rounded-lg p-2 outline-none focus:ring-2 ring-gray"
                    autoComplete="off"
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label htmlFor="other">Other</label>
                  <input
                    type="text"
                    id="other"
                    name="other"
                    placeholder="https://"
                    className="bg-dark-gray rounded-lg p-2 outline-none focus:ring-2 ring-gray"
                    autoComplete="off"
                  />
                </div>
                <FormSubmitButton
                  pendingText="SAVING..."
                  className="w-full bg-primary text-dark font-proximaNovaBold rounded-xl py-2 my-6 hover:bg-light-primary transition"
                >
                  SAVE
                </FormSubmitButton>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
