import { Token } from "@prisma/client";
import Image from "next/image";
import bronzeMedal from "../../public/bronze-medal.svg";
import goldMedal from "../../public/gold-medal.svg";
import silverMedal from "../../public/silver-medal.svg";

export default function VotingLeaderboard({ tokens }: { tokens: Token[] }) {
  return (
    <section className="flex items-center justify-between w-full laptop:w-[75%] desktop:w-[60%] desktop:gap-6">
      {tokens.map((token, index) => (
        <div className="flex items-center gap-1" key={token.id}>
          <Image
            src={index === 0 ? goldMedal : index === 1 ? silverMedal : bronzeMedal}
            alt="gold-medal"
            height={14}
            width={14}
          />

          <span className="hidden laptop:block text-sm">{index === 0 ? "1st" : index === 1 ? "2nd" : "3rd"}</span>

          <span className="text-xs rounded-[4px] bg-green text-black px-2 py-1 font-proximaSoftBold">
            $ {token.ticker}
          </span>
        </div>
      ))}
    </section>
  );
}
