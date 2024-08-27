"use client";

import { Address } from "@/lib/types";
import toast from "react-hot-toast";
import { PiCopyBold } from "react-icons/pi";

type CopyButtonProps = {
  tokenAddress: Address;
};

export default function CopyButton({ tokenAddress }: CopyButtonProps) {
  return (
    <PiCopyBold
      size={25}
      className="text-light-green hover:cursor-pointer hover:text-white transition"
      onClick={() => {
        navigator.clipboard.writeText(tokenAddress);
        toast.success("Copied to clipboard")
      }}
    />
  );
}
