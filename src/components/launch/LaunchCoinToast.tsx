import { etherscanUrl } from "@/config/env";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Address } from "viem";

type LaunchCoinToastProps = {
  txHash: Address;
};

export default function LaunchCoinToast({ txHash }: LaunchCoinToastProps) {
  return (
    <>
      {toast.custom(
        t => (
          <div className="bg-dark-green rounded-lg px-6 py-4 mr-10 mt-16 flex items-center gap-x-3">
            <p>Coin launched</p>
            <Link href={`${etherscanUrl}/tx/${txHash}`} target="_blank">
              <FaExternalLinkAlt size={16} />
            </Link>
          </div>
        ),
        {
          position: "top-right",
          duration: 5000,
        }
      )}
    </>
  );
}
