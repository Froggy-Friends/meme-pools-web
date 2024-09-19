"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import HeaderSocialLinks from "./HeaderSocialLinks";
import frogFunLogo from "../../public/frog-fun-logo.svg";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function LogoPopover() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-start"
      classNames={{
        content: ["bg-dark-gray", "rounded-lg", "p-5", "mt-2", "w-[250px]", "items-start"],
      }}
    >
      <PopoverTrigger className="cursor-pointer">
        <div className="flex items-center gap-x-1" onMouseEnter={() => setIsOpen(true)}>
          <Image
            src={frogFunLogo}
            alt="Frog Fun Logo"
            height={23}
            width={32}
            className="hover:scale-[1.03] transition"
          />
          <Image src="/down-arrow.svg" alt="more" width={12} height={9} />
        </div>
      </PopoverTrigger>
      <PopoverContent onMouseLeave={() => setIsOpen(false)}>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">
            <span className="text-green">FROG</span>.FUN
          </h2>

          <Link href="https://docs.frog.fun/privacy" target="_blank">
            <p className="cursor-pointer text-lg pt-6 hover:text-green">Privacy Policy</p>
          </Link>
          <Link href="https://docs.frog.fun/terms" target="_blank">
            <p className="cursor-pointer text-lg pt-4 hover:text-green">Terms of Service</p>
          </Link>

          <HeaderSocialLinks />
        </div>
      </PopoverContent>
    </Popover>
  );
}
