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
      className="w-5 h-5 tablet:w-6 tablet:h-6 laptop:w-7 laptop:h-7 text-light-primary hover:cursor-pointer hover:text-white transition"
      onClick={() => {
        copy(text);
      }}
    />
  );
}
