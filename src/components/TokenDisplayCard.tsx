"use client";
import Image from "next/image";
import { Token, User } from "@/lib/types";
import Link from "next/link";

type TokenDisplayCardProps = {
  token: Token & { creator: User };
};

export default function TokenDisplayCard({ token }: TokenDisplayCardProps) {
  return (
    <Link
      href={`/token/${token.tokenAddress}`}
      className="flex gap-x-3 w-[31%] pb-10 animate-fadeInSlideUp"
    >
      <Image src={token.image} alt="token-image" height={100} width={100} />

      <div className="flex flex-col">
        <div className="flex gap-x-2">
          <Image
            src={token.creator.imageUrl!}
            alt="creator avatar"
            height={20}
            width={20}
            className="rounded-md"
          />
          <p>Created by {token.creator.name}</p>
        </div>

        <p>market cap...</p>
        <p>replies...</p>
        <p>
          {token.name}({token.ticker}): {token.description}
        </p>
      </div>
    </Link>
  );
}
