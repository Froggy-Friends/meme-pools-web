import { Chain } from "@/models/chain";
import { TokenWithVoteCount } from "@/types/token/types";
import Image from "next/image";
import Link from "next/link";

type SearchTokenDisplayProps = {
  token: TokenWithVoteCount;
  chain: Chain;
};

export default function SearchTokenDisplay({
  token,
  chain,
}: SearchTokenDisplayProps) {
  return (
    <Link
      href={`/${chain}/token/${token.tokenAddress}`}
      className="flex justify-between items-center h-12 w-full px-4 rounded-md hover:bg-midnight-green"
    >
      <div className="flex gap-x-2 items-center">
        <Image
          src={token.image}
          alt="token-image"
          height={40}
          width={40}
          className="rounded-md"
        />
        <p>${token.ticker}</p>
      </div>

      <div className="flex w-1/4 justify-between items-center">
        <p>$32K</p>
        <p>{token._count.TokenVote}</p>
      </div>
    </Link>
  );
}
