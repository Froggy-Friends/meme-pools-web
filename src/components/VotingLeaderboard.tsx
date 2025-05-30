"use client";

import { Token } from "@prisma/client";
import Image from "next/image";
import bronzeMedal from "../../public/bronze-medal.svg";
import goldMedal from "../../public/gold-medal.svg";
import silverMedal from "../../public/silver-medal.svg";
import { useChain } from "@/context/chain";
import Link from "next/link";

type VotingLeaderboardProps = {
  tokens: Token[];
};

export default function VotingLeaderboard({ tokens }: VotingLeaderboardProps) {
  const { chain } = useChain();

  return (
    <section className="flex items-center justify-between w-full laptop:w-[75%] desktop:w-[60%] desktop:gap-6">
      {tokens?.map((token, index) => (
        <Link className="flex items-center gap-1" key={token.id} href={`/${chain.name}/token/${token.tokenAddress}`}>
          <Image
            src={index === 0 ? goldMedal : index === 1 ? silverMedal : bronzeMedal}
            alt="gold-medal"
            height={14}
            width={14}
          />

          <span className="hidden desktop:block text-sm">{index === 0 ? "1st" : index === 1 ? "2nd" : "3rd"}</span>

          <span className="text-xs rounded-[4px] bg-primary text-black px-2 py-1 font-proximaNovaBold max-w-[95px] tablet:max-w-[85px] laptop:max-w-[110px] desktop:max-w-[175px] truncate hover:bg-light-primary transition">
            ${token.ticker}
          </span>
        </Link>
      ))}
    </section>
  );
}
