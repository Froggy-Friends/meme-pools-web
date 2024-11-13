import { ethLogo } from "@/config/chains";
import { formatBalance } from "@/lib/formatBalance";
import { TokenWithVoteCount } from "@/types/token/types";
import Image from "next/image";
import { FaWallet } from "react-icons/fa";

type TokenSwitcherProps = {
  imgName: string;
  imgSrc: string;
  token: TokenWithVoteCount;
  onChange: (ticker: string, tickerSrc: string) => void;
  balance?: number;
};

export default function TokenSwitcher({ imgName, imgSrc, token, onChange, balance }: TokenSwitcherProps) {
  const handleClick = () => {
    imgName === "ETH" ? onChange(token.ticker, token.image) : onChange("ETH", ethLogo);
  };

  return (
    <button onClick={handleClick} className="flex items-center gap-2">
      <Image
        className="h-[35px] w-[35px] object-cover rounded-3xl active:scale-95 transition"
        src={imgSrc}
        alt="ticker"
        width={35}
        height={35}
      />
      <div className="flex flex-col items-start">
        <p className="uppercase -mb-[0.125rem]">${imgName}</p>
        <div className="flex items-center gap-x-1 -mt-[0.085rem]">
          <FaWallet size={12} className="text-light-gray" />
          <p className="text-light-gray text-xs">
            {imgName === "ETH" ? formatBalance(balance || 0, true) : formatBalance(balance || 0)}
          </p>
        </div>
      </div>
    </button>
  );
}
