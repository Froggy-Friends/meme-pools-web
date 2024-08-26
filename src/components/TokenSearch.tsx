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
    <section className="flex items-center ml-8 gap-x-4">
      <button
        onClick={(e) => onOpen()}
        className="flex items-center justify-between h-12 w-80 px-4 border-[0.25px] border-white/[5%] rounded-3xl bg-dark-gray hover:bg-gray transition"
      >
        <div className="flex items-center gap-x-4">
          <FaMagnifyingGlass size={20} />
          <p>$FROGFUN</p>
        </div>

        <div className="flex items-center">
          <MdKeyboardCommandKey size={20} />
          <p className="text-lg font-semibold">K</p>
        </div>
      </button>
      <TokenSearchModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </section>
  );
}
