"use client";

import { useDisclosure } from "@nextui-org/react";
import TokenSearchModal from "./TokenSearchModal";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdKeyboardCommandKey } from "react-icons/md";
import { useEffect } from "react";

export default function TokenSearch() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const down = (e: any) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpen();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpen]);

  return (
    <section className="flex items-center ml-12 tablet:ml-0 w-[200px] tablet:w-[280px] desktop:w-[330px]">
      <button
        onClick={e => onOpen()}
        className="flex items-center justify-between h-8 w-full px-4 border-[0.25px] border-white/[5%] rounded-lg bg-dark-gray hover:bg-gray transition"
      >
        <div className="flex items-center gap-x-4">
          <FaMagnifyingGlass size={16} />
          <p className="text-light-gray flex gap-x-1">
            Search <span className="hidden tablet:block">token</span>
          </p>
        </div>

        <div className="hidden laptop:flex items-center bg-dark rounded-[4px] h-6 px-2">
          <MdKeyboardCommandKey size={14} />
          <p className="font-semibold text-sm">K</p>
        </div>
      </button>
      <TokenSearchModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </section>
  );
}
