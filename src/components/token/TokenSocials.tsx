"use client";

import { FaXTwitter } from "react-icons/fa6";
import { FaTelegram, FaGlobe, FaEdit } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { Token, User } from "@prisma/client";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import useCopy from "@/hooks/useClipboardCopy";
import useXPost from "@/hooks/useXPost";
import { etherscanUrl } from "@/config/env";
import useUser from "@/hooks/useUser";
import EditSocialsModal from "./EditSocialsModal";

type TokenSocialsParams = {
  token: Token;
  cachedUser: User | null;
};

export default function TokenSocials({ token, cachedUser }: TokenSocialsParams) {
  const linkStyles = "py-[0.375rem] px-1 laptop:px-2 text-white/80";
  const copy = useCopy();
  const post = useXPost();
  const { currentUser } = useUser();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleShareLink = () => {
    copy(window.location.href);
  };

  const handleShareX = () => {
    post(`Ape $${token.ticker} with me on @memepoolsx ${window.location.href}`);
  };

  return (
    <div className="flex gap-x-1 items-center mt-2 laptop:mt-4">
      {(cachedUser?.id === token.userId || currentUser?.id === token.userId) && (
        <button onClick={onOpen}>
          <MdOutlineEdit className="w-5 h-5 tablet:w-7 tablet:h-7 text-white/80 hover:text-white hover:scale-[1.02] transition-all" />
        </button>
      )}
      <Link
        href={token.telegram || ""}
        target="_blank"
        className={`${linkStyles} ${
          token.telegram ? "cursor-pointer hover:text-white hover:scale-[1.02]" : "cursor-default"
        } transition-all`}
      >
        <FaTelegram className="w-4 h-4 tablet:w-6 tablet:h-6" />
      </Link>
      <Link
        href={token.website || ""}
        target="_blank"
        className={`${linkStyles} ${
          token.website ? "cursor-pointer hover:text-white hover:scale-[1.02]" : "cursor-default"
        } transition-all`}
      >
        <FaGlobe className="w-4 h-4 tablet:w-6 tablet:h-6" />
      </Link>
      <Link
        href={token.twitter || ""}
        target="_blank"
        className={`${linkStyles} ${
          token.twitter ? "cursor-pointer hover:text-white hover:scale-[1.02]" : "cursor-default"
        } transition-all`}
      >
        <FaXTwitter className="w-4 h-4 tablet:w-6 tablet:h-6" />
      </Link>
      <Dropdown>
        <DropdownTrigger className="outline-none">
          <button>
            <IoMdShareAlt className="w-6 h-6 tablet:w-10 tablet:h-10 text-white/80 hover:text-white hover:scale-[1.02] transition-all" />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Share options">
          <DropdownItem key="share-link" onPress={() => handleShareLink()}>
            Copy link
          </DropdownItem>
          <DropdownItem key="share-x" onPress={() => handleShareX()}>
            Share tweet
          </DropdownItem>
          <DropdownItem
            key="discord"
            isReadOnly={!token.discord}
            className={!token.discord ? "cursor-default" : "cursor-pointer"}
          >
            <Link href={token.discord || ""} target="_blank">
              Discord
            </Link>
          </DropdownItem>
          <DropdownItem key="explorer">
            <Link href={`${etherscanUrl}/token/${token.tokenAddress}`} target="_blank">
              Explorer
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <EditSocialsModal isOpen={isOpen} onClose={onOpenChange} token={token} />
    </div>
  );
}
