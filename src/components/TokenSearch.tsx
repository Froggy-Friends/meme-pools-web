"use client";

import { useDisclosure } from "@nextui-org/react";
import TokenSearchModal from "./TokenSearchModal";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdKeyboardCommandKey } from "react-icons/md";
import { useEffect } from "react";

type TokenSearchProps = {
  classNames?: string;
};

export default function TokenSearch({ classNames }: TokenSearchProps) {
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
    <section className={`flex items-center gap-x-4 w-2/3 ${classNames}`}>
      <button
        onClick={e => onOpen()}
        className="flex items-center justify-between h-8 w-1/3 px-4 border-[0.25px] border-white/[5%] rounded-lg bg-dark-gray hover:bg-gray transition"
      >
        <div className="flex items-center gap-x-4">
          <FaMagnifyingGlass size={16} />
          <p className="text-light-gray">Search token</p>
        </div>

        <div className="flex items-center bg-dark rounded-[4px] h-6 px-2">
          <MdKeyboardCommandKey size={14} />
          <p className="font-semibold text-sm">K</p>
        </div>
      </button>
      <TokenSearchModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </section>
  );
}
