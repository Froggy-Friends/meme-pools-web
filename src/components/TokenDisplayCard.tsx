"use client";

import { useChain } from "@/context/chain";
import { MAX_MARKET_CAP } from "@/lib/constants";
import { TokenWithCreator } from "@/lib/types";
import { TokenWithVotes } from "@/types/token/types";
import { isServer } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { CiGlobe } from "react-icons/ci";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

type TokenDisplayCardProps = {
  token: TokenWithCreator | TokenWithVotes;
  layout?: "horizontal" | "vertical";
};

export default function TokenDisplayCard({
  token,
  layout = "vertical",
}: TokenDisplayCardProps) {
  const { chain } = useChain();

  const marketCapPercentage = (
    (token.marketCap / MAX_MARKET_CAP) *
    100
  ).toFixed(2);

  const isHorizontal = layout === "horizontal";

  if (isServer) return null;

  return (
    <div
      className={`flex rounded-xl overflow-hidden bg-dark-gray ${
        isHorizontal
          ? "flex-row w-[450px] min-w-[450px] h-[240px] min-h-[240px]"
          : "flex-col h-[320px]"
      }`}
    >
      <Link
        href={`/${chain}/token/${token.tokenAddress}`}
        className="flex w-full h-full"
      >
        <div
          className={`flex ${
            isHorizontal ? "flex-row" : "flex-col"
          } w-full h-full`}
        >
          <div className={`${isHorizontal ? "w-[225px]" : "h-32"}`}>
            <Image
              src={token.image}
              alt="token-image"
              width={225}
              height={240}
              className="object-cover w-full h-full"
            />
          </div>
          <div
            className={`flex flex-col ${
              isHorizontal ? "w-[225px]" : "w-full h-full"
            } overflow-hidden`}
          >
            <div className="flex flex-col px-3 mt-3">
              <div className="flex items-center gap-2.5">
                <span>{token.name}</span>
                <span className="bg-green rounded-[4px] text-xs text-black px-2 py-1">
                  ${token.ticker}
                </span>
              </div>

              <div className="flex items-center overflow-hidden gap-1 text-xs my-2">
                <span className="block w-max">Created by:</span>
                <Link
                  href={`/${token.user.name}`}
                  className="text-light-green truncate overflow-hidden block w-1/2 underline"
                >
                  {token.user.name}
                </Link>
              </div>
            </div>

            <p className="flex-grow overflow-y-auto text-light-gray px-3">
              {token.description}
            </p>

            <div className="px-3 pb-3">
              <div className="flex items-center justify-between">
                <div className="text-light-gray text-[10px] flex items-center gap-1">
                  Market Cap:
                  <span className="text-white">${token.marketCap}</span> (
                  {marketCapPercentage}%)
                </div>
                <div className="flex items-center gap-3">
                  {token.twitter && (
                    <a href={token.twitter} target="_blank">
                      <FaXTwitter
                        className="text-light-gray"
                        width={12}
                        height={12}
                      />
                    </a>
                  )}
                  {token.website && (
                    <a href={token.website} target="_blank">
                      <CiGlobe
                        className="text-light-gray"
                        width={12}
                        height={12}
                      />
                    </a>
                  )}
                  {token.telegram && (
                    <a href={token.telegram} target="_blank">
                      <FaTelegramPlane
                        className="text-light-gray"
                        width={12}
                        height={12}
                      />
                    </a>
                  )}
                </div>
              </div>
              <progress
                value={marketCapPercentage}
                max={MAX_MARKET_CAP}
                className="appearance-none [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-bar]:bg-light-gray [&::-webkit-progress-value]:bg-green [&::-moz-progress-bar]:bg-light-gray mt-2 w-full"
              ></progress>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
