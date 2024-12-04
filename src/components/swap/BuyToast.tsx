import { Token } from "@prisma/client";
import Image from "next/image";
import toast from "react-hot-toast";
import { ethLogo } from "@/config/chains";
import { formatEther } from "viem";
import { formatTicker } from "@/lib/formatTicker";
import { formatBalance } from "@/lib/formatBalance";
import { CircularProgress } from "@nextui-org/react";
import Link from "next/link";
import { etherscanUrl } from "@/config/env";
import { FaCheckCircle } from "react-icons/fa";

export const BuyToast = (
  token: Token,
  ethAmount: bigint | number,
  tokenAmount: bigint | number,
  txHash: string,
  duration: number,
  isSuccess: boolean,
  id: string
) => {
  return toast.custom(
    t => (
      <div
        className={`
        bg-dark-gray rounded-xl flex items-center justify-between gap-x-2 p-3 w-[350px]
        transition-all duration-500 ease-in-out
          ${t.visible ? "animate-enter" : "animate-leave"}
        `}
      >
        <div className="flex items-center gap-x-2">
          <div className="flex items-center">
            <Image
              src={ethLogo}
              alt="eth-logo"
              height={30}
              width={30}
              className="rounded-full w-[30px] h-[30px] object-cover"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />

            <Image
              src={token.image}
              alt="token-logo"
              height={30}
              width={30}
              className="rounded-full h-[30px] w-[30px] object-cover -ml-[28px]"
              style={{ clipPath: "inset(0 0 0 50%)" }}
            />
          </div>

          <div className="flex flex-col items-start">
            <p className="-mb-[0.1rem]">{isSuccess ? "Swapped" : "Swapping"}</p>
            <Link
              href={`${etherscanUrl}/tx/${txHash}`}
              className="text-light-gray hover:text-cream transition text-[15px] leading-[1.125]"
              target="_blank"
            >
              {Number(formatEther(BigInt(ethAmount)))
                .toFixed(6)
                .replace(/\.?0+$/, "")}{" "}
              $ETH for {formatBalance(Math.round(Number(formatEther(BigInt(tokenAmount)))))} $
              {formatTicker(token.ticker)}
            </Link>
          </div>
        </div>

        {isSuccess ? (
          <FaCheckCircle className="w-8 h-8 text-primary" />
        ) : (
          <CircularProgress
            classNames={{
              svg: "w-8 h-8 drop-shadow-md",
              indicator: "stroke-primary",
              track: "stroke-white/0",
            }}
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
