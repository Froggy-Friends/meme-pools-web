"use client";

import { useDisclosure } from "@nextui-org/react";
import HowItWorksModal from "./HowItWorksModal";
import { BsQuestionCircle } from "react-icons/bs";

export default function HowItWorksButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <button onClick={onOpen} className="p-2 hover:bg-gray rounded-lg">
        <BsQuestionCircle size={36} className="text-light-gray transition" />
      </button>
      <HowItWorksModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
