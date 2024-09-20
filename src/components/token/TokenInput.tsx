import { useState } from "react";
import Image from "next/image";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";

type TokenInputProps = {
  ticker: string;
  tickerSrc: string;
  chainTicker: string;
  chainTickerSrc: string;
  showChainTicker?: boolean;
  onChange: (value: number | null, tokenName: string, tokenImg: string) => void;
};

export default function TokenInput({
  ticker,
  tickerSrc,
  chainTicker,
  chainTickerSrc,
  showChainTicker,
  onChange,
}: TokenInputProps) {
  const [value, setValue] = useState<string>("");
  const [tokenName, setTokenName] = useState(showChainTicker ? chainTicker : ticker);
  const [tokenImg, setTokenImg] = useState(showChainTicker ? chainTickerSrc : tickerSrc);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (inputValue === "") {
      setValue("");
      onChange(null, tokenName, tokenImg);
      return;
    }

    // Regex to match numbers with up to ten decimal places
    const regex = /^\d*\.?\d{0,10}$/;

    if (regex.test(inputValue)) {
      setValue(inputValue);
      onChange(parseFloat(inputValue), tokenName, tokenImg);
    }
  };

  const handleTickerChange = (ticker: string, tickerSrc: string) => {
    setTokenName(ticker);
    setTokenImg(tickerSrc);
    onChange(parseFloat(value), tokenName, tokenImg);
  };

  return (
    <Input
      classNames={{
        input: "ml-10 appearance-none",
        inputWrapper: ["h-[55px] bg-dark data-[hover=true]:bg-dark data-[focus=true]:bg-dark"],
      }}
      placeholder="0.0"
      value={value}
      onChange={handleChange}
      type="text"
      radius="full"
      startContent={
        <Dropdown className="min-w-0 w-fit py-2 px-3 bg-dark-gray">
          <DropdownTrigger>
            <span className="flex items-center gap-2">
              <Image
                className="h-[35px] w-[35px] rounded-3xl cursor-pointer"
                src={tokenImg}
                alt="ticker"
                width={35}
                height={35}
              />
              <p className="uppercase">${tokenName}</p>
            </span>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="Ticker" onPress={() => handleTickerChange(ticker, tickerSrc)}>
              <div className="flex items-center gap-x-3">
                <Image className="w-[25px] h-[25px] rounded-3xl" src={tickerSrc} alt="ticker" height={25} width={25} />
                <p className="text-[17px]">{ticker}</p>
              </div>
            </DropdownItem>
            <DropdownItem key="ChainTicker" onPress={() => handleTickerChange(chainTicker, chainTickerSrc)}>
              <div className="flex items-center gap-x-3">
                <Image
                  className="w-[25px] h-[25px] rounded-3xl"
                  src={chainTickerSrc}
                  alt="chain-logo"
                  height={25}
                  width={25}
                />
                <p className="text-[17px]">{chainTicker}</p>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      }
    />
  );
}
