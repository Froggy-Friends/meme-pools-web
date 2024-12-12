"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import { defaultProfileAvatarUrl } from "@/config/user";
import { TokenWithVoteCount } from "@/types/token/types";
import Link from "next/link";
import { formatTicker } from "@/lib/formatTicker";

type TokenInfoParams = {
  token: TokenWithVoteCount;
  creator: User | null;
};

export default function TokenInfo({ token, creator }: TokenInfoParams) {
  return (
    <section className="flex flex-col w-full my-2 gap-y-4 pb-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src={token.image} alt="token-image" height={50} width={50} className="h-[50px] w-[50px] rounded-3xl" />
          <p className="hidden tablet:block text-6xl font-proximaNovaBold">${token.ticker}</p>
          <p className="tablet:hidden text-5xl font-proximaNovaBold">${formatTicker(token.ticker)}</p>
        </div>

        <Link
          href={`/memepool/${token.tokenAddress}`}
          className="bg-primary text-black flex items-center justify-center font-proximaNovaBold px-4 h-[30px] rounded-xl hover:bg-light-primary disabled:bg-gray active:scale-[0.98] transition"
        >
          Go to Meme Pool
        </Link>
      </div>
      <div className="flex items-center gap-x-2 pl-3">
        {creator && (
          <Link href={`/profile/${creator.name}`} className="text-light-primary hover:text-cream transition">
            <Image
              src={creator.imageUrl || defaultProfileAvatarUrl}
              alt="creator-logo"
              height={30}
              width={30}
              className="rounded-full"
            />
          </Link>
        )}
        <p className="pl-4">{token.description}</p>
      </div>
    </section>
  );
}
