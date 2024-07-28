"use client"

import { useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { FaCircleInfo, FaSquareXTwitter, FaTelegram } from "react-icons/fa6";
import HowItWorksModal from "./HowItWorksModal";

export default function HeaderSocialLinks() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Link href="https://x.com/frogdotfun" target="_blank">
        <FaSquareXTwitter size={37} />
      </Link>
      <FaTelegram size={35} />
      <button onClick={onOpen}>
        <FaCircleInfo size={35} />
      </button>

      <HowItWorksModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
