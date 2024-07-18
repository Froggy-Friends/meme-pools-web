"use client";

import Logo from "./Logo";
import { FaSquareXTwitter, FaCircleInfo } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";
import ConnectButton from "./ConnectButton";
import Link from "next/link";
import { useDisclosure } from "@nextui-org/react";
import HowItWorksModal from "./HowItWorksModal";

export default function Header() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <header className="flex justify-between items-center h-32">
      <div className="flex gap-x-3 items-center">
        <Logo />
        <Link href="https://x.com/frogdotfun" target="_blank">
          <FaSquareXTwitter size={37} />
        </Link>
        <FaTelegram size={35} />
        <button onClick={onOpen}>
          <FaCircleInfo size={35} />
        </button>
      </div>

      <ConnectButton />
      <HowItWorksModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </header>
  );
}
