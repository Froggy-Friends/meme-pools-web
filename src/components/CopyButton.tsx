"use client";

import { PiCopyBold } from "react-icons/pi";
import useCopy from "@/hooks/useClipboardCopy";

type CopyButtonProps = {
  text: string;
};

export default function CopyButton({ text }: CopyButtonProps) {
  const copy = useCopy();

  return (
    <PiCopyBold
      className="w-5 h-5 laptop:w-8 laptop:h-8 text-light-green hover:cursor-pointer hover:text-white transition"
      onClick={() => {
        copy(text);
      }}
    />
  );
}
