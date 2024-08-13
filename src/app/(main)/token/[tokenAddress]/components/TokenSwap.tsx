"use client";

import { DEFAULT_PRIORITY_FEE, DEFAULT_SLIPPAGE_PERCENT } from "@/config/token";
import { useState } from "react";
import { base } from "viem/chains";
import { useBalance } from "wagmi";
import SlippageModal from "./SlippageModal";

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

const PURCHASE_AMOUNTS = [1, 5, 10];
const SELL_AMOUNTS = [25, 50, 75, 100];

export default function TokenSwap({
  tokenTicker,
  currPrice,
  tokenAddress,
  ethPrice,
}: TradingWidgetProps) {
  const [activeTab, setActiveTab] = useState(TradingTab.BUY);
  const [buyToken, setBuyToken] = useState(tokenTicker);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [slippagePercent, setSlippagePercent] = useState<number>(
    DEFAULT_SLIPPAGE_PERCENT
  );
  const [priorityFee, setPriorityFee] = useState<number>(DEFAULT_PRIORITY_FEE);
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);

  const { data: balance, isLoading: isLoadingBalance } = useBalance({
    address: tokenAddress as `0x${string}`,
    chainId: base.id,
  });

  const switchBuyToken = () => {
    if (buyToken === "ETH") {
      setBuyToken(tokenTicker);
      setTokenAmount((prevEthAmount) => (prevEthAmount * ethPrice) / currPrice);
    } else {
      setBuyToken("ETH");
      setTokenAmount(
        (prevTokenAmount) => (prevTokenAmount * currPrice) / ethPrice
      );
    }
  };

  const placeTrade = () => {};

  if (isLoadingBalance) return null;

  const ownedAmount = balance ? Number(balance.value) : 0;

  return (
    <>
      <div className="p-3 rounded-lg w-[350px] bg-gray-950/90 flex flex-col">
        <div className="w-full flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab(TradingTab.BUY);
              setTokenAmount(0);
            }}
            className={`w-1/2 py-1 rounded-md ${
              activeTab === TradingTab.BUY
                ? "bg-green-500 text-neutral-900"
                : "text-neutral-500 bg-neutral-900"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => {
              setActiveTab(TradingTab.SELL);
              setTokenAmount(0);
            }}
            className={`w-1/2 py-1 rounded-md ${
              activeTab === TradingTab.SELL
                ? "bg-red-500 text-white"
                : "text-neutral-500 bg-neutral-900"
            }`}
          >
            Sell
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-8">
          <div className="w-full flex items-center justify-between">
            {activeTab === TradingTab.BUY && (
              <button
                className="p-1.5 bg-neutral-900 text-neutral-400 text-xs w-max rounded-md"
                onClick={switchBuyToken}
              >
                Switch to {buyToken === "ETH" ? tokenTicker : "ETH"}
              </button>
            )}
            <button
              className="p-1.5 bg-neutral-900 text-neutral-400 text-xs w-max rounded-md ml-auto"
              onClick={() => setIsSlippageModalOpen(true)}
            >
              Set max slippage
            </button>
          </div>
          <div className="w-full flex items-center border border-white rounded-md bg-transparent p-2 placeholder-neutral-400 text-sm focus-within::ring-white focus:ring-1 text-white gap-1">
            <input
              type="number"
              onChange={(e) => setTokenAmount(+e.target.value)}
              value={tokenAmount}
              className="w-full bg-transparent focus:outline-none border-none h-full"
              placeholder="0.0"
            />
            <span>{buyToken}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTokenAmount(0)}
              value={tokenAmount}
              className="p-1.5 bg-gray-950/80 text-neutral-400 text-xs w-max rounded-md"
            >
              reset
            </button>
            {activeTab === TradingTab.BUY
              ? PURCHASE_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTokenAmount(amount)}
                    className="p-1.5 bg-gray-950/80 text-neutral-400 text-xs w-max rounded-md"
                  >
                    {amount} {buyToken}
                  </button>
                ))
              : SELL_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() =>
                      setTokenAmount(+((amount / ownedAmount) * 100).toFixed(2))
                    }
                    className="p-1.5 bg-neutral-900 text-neutral-400 text-xs w-max rounded-md"
                  >
                    {amount}%
                  </button>
                ))}
          </div>
        </div>
        <button
          onClick={placeTrade}
          className="py-2 rounded-md bg-green-400 hover:bg-green-200 transition-colors text-neutral-900 mt-4 text-sm w-full font-medium"
        >
          Place trade
        </button>
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
