import { useChain } from "@/context/chain";
import useTokenInfo from "@/hooks/useTokenInfo";
import { TokenSearchResult } from "@/types/token/types";
import Image from "next/image";
import Link from "next/link";

type SearchTokenDisplayProps = {
  token: TokenSearchResult;
};

export default function SearchTokenDisplay({ token }: SearchTokenDisplayProps) {
  const { chain } = useChain();
  const { tokenInfo } = useTokenInfo(token);

  return (
    <Link
      href={`/${chain.name}/token/${token.tokenAddress}`}
      className="flex justify-between items-center h-12 w-full px-4 rounded-md hover:bg-dark-primary transition"
    >
      <div className="flex gap-x-2 items-center">
        <Image src={token.image} alt="token-image" height={40} width={40} className="rounded-md" />
        <p className="text-light-primary">${token.ticker}</p>
      </div>

      <div className="flex w-1/4 justify-between items-center">
        <p>${tokenInfo?.marketcap?.toFixed(2)}</p>
        <p>{token.voteCount}</p>
      </div>
    </Link>
  );
}
