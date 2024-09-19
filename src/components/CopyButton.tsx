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
      size={25}
      className="text-light-green hover:cursor-pointer hover:text-white transition"
      onClick={() => {
        copy(text);
      }}
    />
  );
}
