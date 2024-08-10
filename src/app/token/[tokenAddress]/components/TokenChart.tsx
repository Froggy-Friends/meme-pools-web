"use client";

import Image from "next/image";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import Link from "next/link";
import { Token } from "../types";
import { User } from "@/app/profile/[wallet]/types";

type TokenChartParams = {
  token: Token;
  creator: User;
};

export default function TokenChart({ token, creator }: TokenChartParams) {
  return (
    <section>
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-x-2">
          <p>{token.name}</p>
          <p>{token.ticker}</p>
          <p>Marketcap...</p>
          <p>CA: {token.tokenAddress}</p>
        </div>

        <div className="flex gap-x-2">
          <p>Created by</p>
          <Image
            src={creator.imageUrl!}
            alt="creator-logo"
            height={20}
            width={20}
          />
          <p>
            <Link href={`/profile/${creator.wallet}`} className="hover:underline">{creator.name}</Link>
          </p>
        </div>
      </div>

      <AdvancedRealTimeChart
        theme="dark"
        width="100%"
        height="600px"
      ></AdvancedRealTimeChart>
    </section>
  );
}
