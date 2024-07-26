"use client";

import Logo from "./Logo";
import { FaSquareXTwitter, FaCircleInfo } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";
import ConnectButton from "./ConnectButton";
import Link from "next/link";
import { useDisclosure } from "@nextui-org/react";
import HowItWorksModal from "./HowItWorksModal";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { createUser } from "@/lib/actions";
import ProfileAvatar from "./ProfileAvatar";

export default function Header() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      createUser({
        wallet: address
      })
    }
  }, [isConnected, address])

  return (
    <header className="flex justify-between items-center h-32 px-12">
      <div className="flex gap-x-3 items-center">
        <Link href="/"><Logo /></Link>
        <Link href="https://x.com/frogdotfun" target="_blank">
          <FaSquareXTwitter size={37} />
        </Link>
        <FaTelegram size={35} />
        <button onClick={onOpen}>
          <FaCircleInfo size={35} />
        </button>
      </div>

      {!isConnected ? <ConnectButton /> : <ProfileAvatar />}
      <HowItWorksModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </header>
  );
}
