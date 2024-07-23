"use client";

import { useState } from "react";

enum TradingTab {
  BUY,
  SELL,
}

type TradingWidgetProps = {
  tokenName: string;
  ownedAmount: number;
  currPrice: number;
};

const PURCHASE_AMOUNTS = [1, 5, 10];
const SELL_AMOUNTS = [25, 50, 75, 100];

export default function TradingWidget({
  tokenName,
  ownedAmount,
  currPrice,
}: TradingWidgetProps) {
  const [activeTab, setActiveTab] = useState(TradingTab.BUY);
  const [buyToken, setBuyToken] = useState(tokenName);
  const [tokenAmount, setTokenAmount] = useState<number>(0);

  const switchBuyToken = () => {
    if (buyToken === "ETH") {
      setBuyToken(tokenName);
      setTokenAmount((tokenAmount) => tokenAmount * currPrice);
    } else {
      setBuyToken("ETH");
      setTokenAmount((tokenAmount) => tokenAmount / currPrice);
    }
  };

  const placeTrade = () => {};

  return (
    <div className="p-3 rounded-lg w-[350px] bg-neutral-700 flex flex-col">
      <div className="w-full flex items-center gap-2">
        <button
          onClick={() => {
            setActiveTab(TradingTab.BUY);
            setTokenAmount(0);
          }}
          className={`w-1/2 py-1 rounded-md ${
            activeTab === TradingTab.BUY
              ? "bg-green-400 text-neutral-900"
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
              ? "bg-red-400 text-white"
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
              className="p-1.5 bg-neutral-900 text-neutral-500 text-xs w-max rounded-md"
              onClick={switchBuyToken}
            >
              Switch to {buyToken === "ETH" ? tokenName : "ETH"}
            </button>
          )}
          <button className="p-1.5 bg-neutral-900 text-neutral-500 text-xs w-max rounded-md ml-auto">
            Set max slippage
          </button>
        </div>
        <input
          type="number"
          onChange={(e) => setTokenAmount(+e.target.value)}
          value={tokenAmount}
          className="w-full border border-white rounded-md bg-transparent p-2 placeholder-neutral-500 text-sm focus:ring-white focus:ring-1 focus:outline-none text-white"
          placeholder="0.0"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTokenAmount(0)}
            onChange={(e) => setTokenAmount(tokenAmount)}
            value={tokenAmount}
            className="p-1.5 bg-neutral-900 text-neutral-500 text-xs w-max rounded-md"
          >
            reset
          </button>
          {activeTab === TradingTab.BUY
            ? PURCHASE_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTokenAmount(amount)}
                  className="p-1.5 bg-neutral-900 text-neutral-500 text-xs w-max rounded-md"
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
                  className="p-1.5 bg-neutral-900 text-neutral-500 text-xs w-max rounded-md"
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
  );
}
