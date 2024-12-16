"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import { defaultProfileAvatarUrl } from "@/config/user";
import { TokenWithVoteCount } from "@/types/token/types";
import Link from "next/link";
import { formatTicker } from "@/lib/formatTicker";
import memePoolIcon from "../../../public/memepools.svg";

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
          className="hidden tablet:flex bg-dark-gray items-center justify-center gap-x-1 font-proximaNovaBold px-6 py-1 rounded-xl hover:bg-gray active:scale-[0.98] transition"
        >
          <Image src={memePoolIcon} alt="memepool-icon" height={30} width={30} />
          <p>View Meme Pool</p>
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-x-2 pl-3 flex-1">
          {creator && (
            <Link
              href={`/profile/${creator.name}`}
              className="text-light-primary hover:text-cream transition flex-shrink-0"
            >
              <Image
                src={creator.imageUrl || defaultProfileAvatarUrl}
                alt="creator-logo"
                height={30}
                width={30}
                className="rounded-full h-[30px] w-[30px] object-cover"
              />
            </Link>
          )}
          <p className="hidden tablet:block pl-4 break-words">{token.description}</p>
          <p className="tablet:hidden pl-4 max-w-[190px] truncate">{token.description}</p>
        </div>

        <Link
          href={`/memepool/${token.tokenAddress}`}
          className="flex tablet:hidden bg-dark-gray items-center justify-center gap-x-1 font-proximaNovaBold px-3 py-0.5 rounded-xl hover:bg-gray active:scale-[0.98] transition"
        >
          <Image src={memePoolIcon} alt="memepool-icon" height={25} width={25} />
          <p className="text-sm">View MP</p>
        </Link>
      </div>
    </section>
  );
}
