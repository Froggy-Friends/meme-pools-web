"use client";

import { useDisclosure } from "@nextui-org/react";
import TokenSearchModal from "./TokenSearchModal";
import { Chain } from "@/models/chain";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdKeyboardCommandKey } from "react-icons/md";

type TokenSearchProps = {
  chain: Chain;
};

export default function TokenSearch({ chain }: TokenSearchProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <section className="flex items-center gap-x-4">
      <button
        onClick={() => onOpen()}
        className="flex items-center justify-between h-12 w-80 px-4 border-[0.25px] border-cream rounded-3xl bg-dark-gray hover:bg-dark"
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
      <TokenSearchModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        chain={chain}
      />
    </section>
  );
}
