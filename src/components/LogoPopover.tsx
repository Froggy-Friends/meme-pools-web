"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import HeaderSocialLinks from "./HeaderSocialLinks";
import memepoolsLogo from "../../public/memepools.svg";
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
          <Image src={memepoolsLogo} alt="Memepools" height={45} width={45} className="hover:scale-[1.03] transition" />
          <p className="hidden laptop:block text-2xl font-allumiBold">Memepools</p>
          <Image src="/down-arrow.svg" alt="more" width={12} height={9} />
        </div>
      </PopoverTrigger>
      <PopoverContent onMouseLeave={() => setIsOpen(false)}>
        <div className="flex flex-col">
          <Link className="flex gap-2 text-2xl font-bold cursor-pointer" href="/">
            <Image
              src={memepoolsLogo}
              alt="Memepools"
              height={23}
              width={32}
              className="hover:scale-[1.03] transition"
            />
            <div>Memepools</div>
          </Link>

          <Link href="https://docs.memepools.com" target="_blank">
            <p className="cursor-pointer text-lg pt-4 hover:text-primary transition">Docs</p>
          </Link>
          <Link href="https://docs.memepools.com/terms" target="_blank">
            <p className="cursor-pointer text-lg hover:text-primary transition">Terms</p>
          </Link>

          <HeaderSocialLinks />
        </div>
      </PopoverContent>
    </Popover>
  );
}
