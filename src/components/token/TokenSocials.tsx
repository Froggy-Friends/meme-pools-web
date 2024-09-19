"use client";

import { FaXTwitter } from "react-icons/fa6";
import { FaTelegram, FaGlobe } from "react-icons/fa";
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
  const linkStyles = "bg-dark-gray rounded-3xl py-[0.375rem] px-6 hover:bg-gray transition";
  const copy = useCopy();
  const post = useXPost();

  const handleShareLink = () => {
    copy(window.location.href);
  };

  const handleShareX = () => {
    post(`Ape $${token.ticker} with me on @frogdotfun ${window.location.href}`);
  };

  return (
    <div className="flex gap-x-1 items-center mt-6">
      <Link href={token.telegram || ""} className={linkStyles}>
        <FaTelegram size={25} />
      </Link>
      <Link href={token.website || ""} className={linkStyles}>
        <FaGlobe size={25} />
      </Link>
      <Link href={token.twitter || ""} className={linkStyles}>
        <FaXTwitter size={23} />
      </Link>
      <Dropdown>
        <DropdownTrigger>
          <div className="flex gap-2">
            <button className={linkStyles}>
              <Image src="/share.svg" alt="share" width={25} height={25} />
            </button>
            <Image src="/down-arrow.svg" alt="more" width={12} height={9} />
          </div>
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
