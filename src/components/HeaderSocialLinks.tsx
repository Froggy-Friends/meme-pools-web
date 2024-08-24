"use client";

import { useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { FaSquareXTwitter, FaTelegram } from "react-icons/fa6";
import { BsQuestionCircleFill } from "react-icons/bs";
import HowItWorksModal from "./HowItWorksModal";

export default function HeaderSocialLinks() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex items-center gap-x-4 mt-14">
      <button onClick={onOpen}>
        <BsQuestionCircleFill
          size={35}
          className="hover:text-white/80 hover:scale-[1.03] transition"
        />
      </button>
      <FaTelegram
        size={35}
        className="hover:text-white/80 hover:scale-[1.03] transition"
      />
      <Link href="https://x.com/frogdotfun" target="_blank">
        <FaSquareXTwitter
          size={37}
          className="hover:text-white/80 hover:scale-[1.03] transition"
        />
      </Link>
      <HowItWorksModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
