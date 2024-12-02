import { Token } from "@prisma/client";
import Image from "next/image";
import toast from "react-hot-toast";
import { formatTicker } from "@/lib/formatTicker";
import { CircularProgress } from "@nextui-org/react";
import Link from "next/link";
import { etherscanUrl } from "@/config/env";
import { FaCheckCircle } from "react-icons/fa";

export const ApproveToast = (token: Token, txHash: string, duration: number, isSuccess: boolean, id: string) => {
  return toast.custom(
    t => (
      <div
        className={`
        bg-dark-gray rounded-xl flex items-center justify-between p-3 w-[350px]
        transition-all duration-500 ease-in-out
          ${t.visible ? "animate-enter" : "animate-leave"}
        `}
      >
        <div className="flex items-center gap-x-2">
          <Image
            src={token.image}
            alt="token-logo"
            height={30}
            width={30}
            className="rounded-full h-[30px] w-[30px] object-cover"
          />

          <div className="flex flex-col items-start">
            <p className="-mb-1">{isSuccess ? "Approved" : "Approving"}</p>
            <Link
              href={`${etherscanUrl}/tx/${txHash}`}
              className="text-light-gray hover:text-cream transition text-[15px]"
              target="_blank"
            >
              $1B ${formatTicker(token.ticker)}
            </Link>
          </div>
        </div>

        {isSuccess ? (
          <FaCheckCircle className="w-8 h-8 text-primary ml-4" />
        ) : (
          <CircularProgress
            classNames={{
              svg: "w-8 h-8 drop-shadow-md",
              indicator: "stroke-primary",
              track: "stroke-white/0",
            }}
            className="ml-4"
          />
        )}
      </div>
    ),
    {
      duration: duration,
      id: id,
    }
  );
};
