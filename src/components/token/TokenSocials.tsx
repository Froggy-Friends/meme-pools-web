"use client";

import { FaXTwitter } from "react-icons/fa6";
import { FaTelegram, FaGlobe } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { Token } from "@prisma/client";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import useCopy from "@/hooks/useClipboardCopy";
import useXPost from "@/hooks/useXPost";

type TokenSocialsParams = {
  token: Token;
};

export default function TokenSocials({ token }: TokenSocialsParams) {
  const linkStyles = "py-[0.375rem] px-1 laptop:px-2";
  const copy = useCopy();
  const post = useXPost();

  const handleShareLink = () => {
    copy(window.location.href);
  };

  const handleShareX = () => {
    post(`Ape $${token.ticker} with me on @frogdotfun ${window.location.href}`);
  };

  return (
    <div className="flex gap-x-1 items-center mt-2 laptop:mt-4">
      <Link href={token.telegram || ""} className={linkStyles}>
        <FaTelegram className="w-4 h-4 tablet:w-6 tablet:h-6 laptop:w-8 laptop:h-8" />
      </Link>
      <Link href={token.website || ""} className={linkStyles}>
        <FaGlobe className="w-4 h-4 tablet:w-6 tablet:h-6 laptop:w-8 laptop:h-8" />
      </Link>
      <Link href={token.twitter || ""} className={linkStyles}>
        <FaXTwitter className="w-4 h-4 tablet:w-6 tablet:h-6 laptop:w-8 laptop:h-8" />
      </Link>
      <Dropdown>
        <DropdownTrigger className="outline-none">
          <button>
            <IoMdShareAlt className="w-6 h-6 tablet:w-10 tablet:h-10 laptop:w-12 laptop:h-12" />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Share options">
          <DropdownItem key="share-link" onPress={() => handleShareLink()}>
            Share link
          </DropdownItem>
          <DropdownItem key="share-x" onPress={() => handleShareX()}>
            Share on X
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
