"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import { defaultProfileAvatarUrl } from "@/config/user";
import { TokenWithVoteCount } from "@/types/token/types";
import Link from "next/link";
import { getUserDisplayName } from "@/lib/getUserDisplayName";
import { formatTicker } from "@/lib/formatTicker";

type TokenInfoParams = {
  token: TokenWithVoteCount;
  creator: User | null;
};

export default function TokenInfo({ token, creator }: TokenInfoParams) {
  return (
    <section className="flex flex-col w-full my-2 gap-y-4 pb-10">
      <div className="flex items-center gap-4">
        <Image src={token.image} alt="token-image" height={50} width={50} className="h-[50px] w-[50px] rounded-3xl" />
        <p className="hidden tablet:block text-6xl font-proximaSoftBold">${token.ticker}</p>
        <p className="tablet:hidden text-5xl font-proximaSoftBold">${formatTicker(token.ticker)}</p>
      </div>

      <div className="flex items-center gap-x-2">
        <p>Created by:</p>
        {creator && (
          <Image
            src={creator.imageUrl || defaultProfileAvatarUrl}
            alt="creator-logo"
            height={30}
            width={30}
            className="rounded-full"
          />
        )}
        {creator && (
          <Link href={`/profile/${creator.name}`} className="text-light-green hover:text-cream transition">
            {getUserDisplayName(creator.name)}
          </Link>
        )}
      </div>
      <p>{token.description}</p>
    </section>
  );
}
