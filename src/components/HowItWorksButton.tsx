"use client";

import { useDisclosure } from "@nextui-org/react";
import HowItWorksModal from "./HowItWorksModal";

type HowItWorksButtonProps = {
  children: React.ReactNode;
}

export default function HowItWorksButton({ children }: HowItWorksButtonProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <button onClick={onOpen} className="p-1 laptop:p-2 hover:bg-gray rounded-lg transition">
        {children}
      </button>
      <HowItWorksModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
