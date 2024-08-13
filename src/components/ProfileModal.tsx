"use client";

import { useAccount, useDisconnect } from "wagmi";
import { Address } from "@coinbase/onchainkit/identity";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import FormSubmitButton from "./FormSubmitButton";
import { toast } from "react-hot-toast";
import { updateUserData } from "@/app/(main)/profile/[wallet]/actions";

type HowItWorkdsModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
};

export default function ProfileModal({
  isOpen,
  onOpenChange,
  onClose,
}: HowItWorkdsModalProps) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleSubmit = async (formData: FormData) => {
    await updateUserData(formData, address!);

    setTimeout(() => {
      toast.success("Profile successfully updated!");

      onClose();
    }, 2500);
  };

  return (
    <>
      {address && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <form action={handleSubmit}>
            <ModalContent className="bg-gray-950/95">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-white">
                    <div className="flex items-center justify-between pt-6">
                      <p>Edit Profile</p>
                      <p className="py-2 px-3 bg-gray-800 rounded-md">
                        <Address address={address} isSliced={true} />
                      </p>
                      <button
                        className="py-2 px-3 text-base bg-gray-800 rounded-md hover:bg-gray-800/80"
                        onClick={() => disconnect()}
                      >
                        Disconnect
                      </button>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="name" className="text-white mb-1">
                        Profile name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full border border-white rounded-md bg-transparent p-2 placeholder-neutral-400 text-sm focus:ring-white focus:ring-1 focus:outline-none text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="profileImage" className="text-white mb-1">
                        Proile image
                      </label>
                      <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        className="w-full border border-white rounded-md bg-transparent p-2 placeholder-neutral-400 text-sm focus:ring-white focus:ring-1 focus:outline-none text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="email" className="text-white mb-1">
                        Email
                      </label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        className="w-full border border-white rounded-md bg-transparent p-2 placeholder-neutral-400 text-sm focus:ring-white focus:ring-1 focus:outline-none text-white"
                      />
                    </div>
                    <FormSubmitButton className="w-full mt-1 py-2 px-3 bg-gray-800 rounded-md hover:bg-gray-800/80 text-white flex justify-center active:scale-[0.97]">
                      <p className="py-1 font-semibold">Save</p>
                    </FormSubmitButton>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </form>
        </Modal>
      )}
    </>
  );
}
