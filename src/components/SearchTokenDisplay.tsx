import { useChain } from "@/context/chain";
import useTokenInfo from "@/hooks/useTokenInfo";
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
      href={`/${chain.name}/token/${token.tokenAddress}`}
      className="flex justify-between items-center h-12 w-full px-2 rounded-md hover:bg-dark-primary transition"
      onClick={onClose}
    >
      <div className="flex gap-x-2 items-center">
        <Image src={token.image} alt="token-image" height={40} width={40} className="rounded-md" />
        <p className="text-light-primary text-sm tablet:text-base truncate max-w-[100px] tablet:max-w-[150px]">
          ${token.ticker}
        </p>
      </div>

      <div className="flex max-w-[65%] tablet:w-1/2 justify-between items-center">
        <p className="w-24 text-right text-sm tablet:text-base">{formattedDate}</p>
        <p className="w-24 text-right text-sm tablet:text-base">{formattedTime}</p>
        <p className="w-16 text-right text-sm tablet:text-base">${formatMarketcap(tokenInfo?.marketcap || 0)}</p>
      </div>
    </Link>
  );
}
