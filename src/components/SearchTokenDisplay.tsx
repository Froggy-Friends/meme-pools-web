import { useChain } from "@/context/chain";
import { TokenWithVoteCount } from "@/types/token/types";
import Image from "next/image";
import Link from "next/link";

type SearchTokenDisplayProps = {
  token: TokenWithVoteCount;
};

export default function SearchTokenDisplay({ token }: SearchTokenDisplayProps) {
  const { chain } = useChain();

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
        <p className="text-light-green">${token.ticker}</p>
      </div>

      <div className="flex w-1/4 justify-between items-center">
        <p>${token.marketCap}</p>
        <p>{token._count.TokenVote}</p>
      </div>
    </Link>
  );
}
