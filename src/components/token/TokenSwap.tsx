"use client";

import { defualtPriorityFee, defaultSlippagePercent } from "@/config/eth/token";
import { useState } from "react";
import { mainnet } from "viem/chains";
import { useBalance } from "wagmi";
import SlippageModal from "./SlippageModal";
import Image from "next/image";
import { Input } from "@nextui-org/react";
import { ethLogo } from "@/config/chains";
import { useChain } from "@/context/chain";

enum TradingTab {
  BUY,
  SELL,
}

type TradingWidgetProps = {
  tokenTicker: string;
  tokenAddress: string;
  currPrice: number;
  ethPrice: number;
};

const PURCHASE_AMOUNTS = [1, 5, 10, 20];
const SELL_AMOUNTS = [25, 50, 75, 100];

export default function TokenSwap({ tokenTicker, currPrice, tokenAddress, ethPrice }: TradingWidgetProps) {
  const { chain } = useChain();
  const [activeTab, setActiveTab] = useState(TradingTab.BUY);
  const [buyToken, setBuyToken] = useState(tokenTicker);
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [slippagePercent, setSlippagePercent] = useState<number>(defaultSlippagePercent);
  const [priorityFee, setPriorityFee] = useState<number>(defualtPriorityFee);
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);

  const { data: balance, isLoading: isLoadingBalance } = useBalance({
    address: tokenAddress as `0x${string}`,
    chainId: mainnet.id,
  });

  const switchBuyToken = () => {
    if (buyToken === "ETH") {
      setBuyToken(tokenTicker);
      setBuyAmount(prevEthAmount => (prevEthAmount * ethPrice) / currPrice);
    } else {
      setBuyToken("ETH");
      setSellAmount(prevTokenAmount => (prevTokenAmount * currPrice) / ethPrice);
    }
  };

  const placeTrade = () => {};

  if (isLoadingBalance) return null;

  const ownedAmount = balance ? Number(balance.value) : 0;

  return (
    <>
      <div className="p-3 rounded-lg w-[350px] bg-gray-950/90 flex flex-col">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab(TradingTab.BUY);
                setBuyAmount(0);
              }}
              className={`w-[65px] h-[35px] rounded-3xl text-white ${
                activeTab === TradingTab.BUY ? "bg-gray" : "bg-dark-gray"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => {
                setActiveTab(TradingTab.SELL);
                setSellAmount(0);
              }}
              className={`w-[65px] h-[35px] rounded-3xl text-white ${
                activeTab === TradingTab.SELL ? "bg-gray" : "bg-dark-gray"
              }`}
            >
              Sell
            </button>
          </div>
          <button className="flex justify-center items-center w-[65px] h-[35px] rounded-3xl bg-dark-gray">
            <Image src="/setting.svg" alt="slippage" height={20} width={20} />
          </button>
        </div>
        <div className="flex flex-col gap-2 p-4 mt-4 rounded-3xl bg-dark-gray w-full h-[200px]">
          <Input
            classNames={{
              input: "ml-8 appearance-none",
              inputWrapper: ["h-[55px] bg-dark data-[hover=true]:bg-dark data-[focus=true]:bg-dark"],
            }}
            type="number"
            radius="full"
            placeholder="0.0"
            onChange={e =>
              activeTab === TradingTab.BUY
                ? setBuyAmount(Number(e.target.value))
                : setSellAmount(Number(e.target.value))
            }
            value={activeTab === TradingTab.BUY ? buyAmount.toString() : sellAmount.toString()}
            startContent={
              <span className="flex items-center gap-2">
                <Image src={ethLogo} alt="Eth" width={35} height={35} />
                <p className="uppercase">${chain.name}</p>
              </span>
            }
          />
          <div className="flex items-center pl-4 gap-2">
            <button
              onClick={() => (activeTab === TradingTab.BUY ? setBuyAmount(0) : setSellAmount(0))}
              className="flex items-center justify-center bg-dark rounded-2xl p-2"
            >
              <Image src="/reset.svg" alt="reset" width={10} height={10} />
            </button>
            {activeTab === TradingTab.BUY
              ? PURCHASE_AMOUNTS.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBuyAmount(amount)}
                    className={`flex items-center justify-center p-2 text-sm w-[45px] h-[25px] rounded-2xl ${
                      amount === buyAmount ? "bg-gray" : "bg-dark"
                    }`}
                  >
                    {amount}
                  </button>
                ))
              : SELL_AMOUNTS.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setSellAmount(+((amount / ownedAmount) * 100).toFixed(2))}
                    className={`flex items-center justify-center p-2 text-sm w-[45px] h-[25px] rounded-2xl ${
                      amount === sellAmount ? "bg-gray" : "bg-dark"
                    }`}
                  >
                    {amount}%
                  </button>
                ))}
          </div>
          <button
            onClick={placeTrade}
            className="flex items-center justify-center w-full h-[40px] p-4 mt-9 rounded-3xl text-lg text-black font-proximaSoftBold bg-green hover:bg-opacity-80 transition-colors"
          >
            TRADE
          </button>
        </div>
      </div>
      <SlippageModal
        isOpen={isSlippageModalOpen}
        onClose={({ slippagePercent, priorityFee }) => {
          setSlippagePercent(slippagePercent);
          setPriorityFee(priorityFee);
          setIsSlippageModalOpen(false);
        }}
      />
    </>
  );
}
