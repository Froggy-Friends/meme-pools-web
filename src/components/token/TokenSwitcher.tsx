import { ethLogo } from "@/config/chains";
import { formatBalance } from "@/lib/formatBalance";
import { formatTicker } from "@/lib/formatTicker";
import { TokenWithVoteCount } from "@/types/token/types";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import Image from "next/image";
import { FaWallet } from "react-icons/fa";

type TokenSwitcherProps = {
  imgName: string;
  imgSrc: string;
  token: TokenWithVoteCount;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onChange: (ticker: string, tickerSrc: string) => void;
  balance?: number;
};

export default function TokenSwitcher({
  imgName,
  imgSrc,
  token,
  isOpen,
  setIsOpen,
  onChange,
  balance,
}: TokenSwitcherProps) {
  return (
    <Dropdown className="min-w-0 w-fit py-2 px-3 bg-dark-gray" isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <span className="flex items-center gap-2">
          <Image
            className="h-[35px] w-[35px] rounded-3xl border-primary border-medium cursor-pointer"
            src={imgSrc}
            alt="ticker"
            width={35}
            height={35}
          />
          <div className="flex flex-col">
            <p className="uppercase -mb-[0.125rem]">${imgName}</p>
            <div className="flex items-center gap-x-1 -mt-[0.085rem]">
              <FaWallet size={12} className="text-light-gray" />
              <p className="text-light-gray text-xs">
                {imgName === "ETH" ? formatBalance(balance || 0, true) : formatBalance(balance || 0)}
              </p>
            </div>
          </div>
        </span>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="ChainTicker" onPress={() => onChange("ETH", ethLogo)}>
          <div className="flex items-center gap-x-3">
            <Image className="w-[25px] h-[25px] rounded-3xl" src={ethLogo} alt="chain-logo" height={25} width={25} />
            <p className="text-[17px]">ETH</p>
          </div>
        </DropdownItem>
        <DropdownItem key="Ticker" onPress={() => onChange(token.ticker, token.image)}>
          <div className="flex items-center gap-x-3">
            <Image className="w-[25px] h-[25px] rounded-3xl" src={token.image} alt="ticker" height={25} width={25} />
            <p className="text-[17px]">{formatTicker(token.ticker)}</p>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
