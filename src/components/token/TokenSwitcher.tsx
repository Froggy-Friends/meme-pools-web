import { ethLogo } from "@/config/chains";
import { formatTicker } from "@/lib/formatTicker";
import { TokenWithVoteCount } from "@/types/token/types";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import Image from "next/image";

type TokenSwitcherProps = {
  imgName: string;
  imgSrc: string;
  token: TokenWithVoteCount;
  onChange: (ticker: string, tickerSrc: string) => void;
};

export default function TokenSwitcher({ imgName, imgSrc, token, onChange }: TokenSwitcherProps) {
  return (
    <Dropdown className="min-w-0 w-fit py-2 px-3 bg-dark-gray">
      <DropdownTrigger>
        <span className="flex items-center gap-2">
          <Image
            className="h-[35px] w-[35px] rounded-3xl border-primary border-medium cursor-pointer"
            src={imgSrc}
            alt="ticker"
            width={35}
            height={35}
          />
          <p className="uppercase">${imgName}</p>
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
