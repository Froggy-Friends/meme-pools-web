import { useChain } from "@/context/chain";
import useTokenInfo from "@/hooks/useTokenInfo";
import { formatAddress } from "@/lib/formatAddress";
import { formatMarketcap } from "@/lib/formatMarketcap";
import { TokenSearchResult } from "@/types/token/types";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

type SearchTokenDisplayProps = {
  token: TokenSearchResult;
  onClose: () => void;
};

export default function SearchTokenDisplay({ token, onClose }: SearchTokenDisplayProps) {
  const { chain } = useChain();
  const { tokenInfo } = useTokenInfo(token);
  const formattedDate = dayjs(token.createdAt).format("MMM D, YY");
  const formattedTime = dayjs(token.createdAt).format("hh:mm:ss A");

  return (
    <Link
      href={
        token.origin === "internal" ? `/${chain.name}/token/${token.tokenAddress}` : `/memepool/${token.tokenAddress}`
      }
      className="flex justify-between items-center h-12 w-full px-2 rounded-md hover:bg-dark-primary transition"
      onClick={onClose}
    >
      <div className="flex gap-x-2 items-center">
        <Image src={token.image} alt="token-image" height={40} width={40} className="rounded-md" />
        <div className="flex flex-col justify-center min-w-0 w-[100px] tablet:w-[150px]">
          <p className="text-light-primary text-sm tablet:text-base truncate">${token.ticker}</p>
          <p className="text-light-gray text-xs tablet:text-sm -mt-[2px] truncate">
            CA: {formatAddress(token.tokenAddress)}
          </p>
        </div>
      </div>

      <div className="flex max-w-[65%] tablet:w-1/2 justify-between items-center">
        <p className="w-24 text-right text-sm tablet:text-base">
          {token.origin === "internal" ? formattedDate : "-----"}
        </p>
        <p className="w-24 text-right text-sm tablet:text-base">
          {token.origin === "internal" ? formattedTime : "-----"}
        </p>
        <p className="w-16 text-right text-sm tablet:text-base">
          ${token.origin === "internal" ? formatMarketcap(tokenInfo?.marketcap || 0) : "-----"}
        </p>
      </div>
    </Link>
  );
}
