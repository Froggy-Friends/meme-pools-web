"use client";

import { defualtPriorityFee, defaultSlippagePercent } from "@/config/eth/token";
import { ChangeEvent, useState } from "react";
import { mainnet } from "viem/chains";
import { useBalance } from "wagmi";
import SlippageModal from "./SlippageModal";
import Image from "next/image";
import { useChain } from "@/context/chain";
import useBuyToken from "@/hooks/useBuyToken";
import { parseUnits } from "viem";
import { TokenWithVoteCount } from "@/types/token/types";
import useBuyPrice from "@/hooks/useBuyPrice";
import { Input } from "@nextui-org/react";
import TokenSwitcher from "./TokenSwitcher";

enum TradingTab {
  BUY,
  SELL,
}

type TradingWidgetProps = {
  token: TokenWithVoteCount;
  currPrice: number;
  ethPrice: number;
};

const PURCHASE_AMOUNTS = ["1", "2", "3", "4"];
const SELL_AMOUNTS = ["25", "50", "75", "100"];

export default function TokenSwap({ token, currPrice, ethPrice }: TradingWidgetProps) {
  const { ticker, tokenAddress } = token;
  const { chain } = useChain();
  const [activeTab, setActiveTab] = useState(TradingTab.BUY);
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [buyTokenName, setBuyTokenName] = useState(token.ticker);
  const [buyTokenSrc, setBuyTokenSrc] = useState(token.image);
  const [slippagePercent, setSlippagePercent] = useState<number>(defaultSlippagePercent);
  const [priorityFee, setPriorityFee] = useState<number>(defualtPriorityFee);
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const buyToken = useBuyToken();
  const buyPrice = useBuyPrice();
  const tokenAmountRule = /^\d*\.?\d{0,10}$/; // Regex to match numbers with up to ten decimal places

  const { data: balance, isLoading: isLoadingBalance } = useBalance({
    address: tokenAddress as `0x${string}`,
    chainId: mainnet.id,
  });

  const ownedAmount = balance ? Number(balance.value) : 0;

  // setBuyAmount(prevEthAmount => (prevEthAmount * ethPrice) / currPrice);

  const handleBuyAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (inputValue === "") {
      setBuyAmount("");
      return;
    }

    if (tokenAmountRule.test(inputValue)) {
      setBuyAmount(inputValue);
    }
  };

  const handleSellAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (inputValue === "") {
      setSellAmount("");
      return;
    }

    if (tokenAmountRule.test(inputValue)) {
      setSellAmount(inputValue);
    }
  };

  const tokensByPercentage = (amount: string, totalOwned: number) => {
    return ((parseFloat(amount) / totalOwned) * 100).toFixed(2);
  };

  const buyTokens = async () => {
    const buyAmountWei = parseUnits(buyAmount.toString(), 18);
    console.log("buy for address: ", tokenAddress);
    console.log("buy amount wei: ", buyAmountWei);

    const bought = await buyToken(tokenAddress, buyAmountWei);
    console.log("bought: ", bought);
  };

  const sellTokens = () => {};

  return (
    <>
      <div className="flex flex-col rounded-lg w-[350px] mt-7">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab(TradingTab.BUY);
                setBuyAmount("");
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
                setSellAmount("");
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
          {activeTab === TradingTab.BUY && (
            <Input
              classNames={{
                input: "ml-10 appearance-none",
                inputWrapper: ["h-[55px] bg-dark data-[hover=true]:bg-dark data-[focus=true]:bg-dark"],
              }}
              placeholder="0.0"
              value={buyAmount}
              onChange={handleBuyAmountChange}
              type="text"
              radius="full"
              startContent={
                <TokenSwitcher
                  imgName={buyTokenName}
                  imgSrc={buyTokenSrc}
                  token={token}
                  onChange={(ticker, tickerSrc) => {
                    setBuyTokenName(ticker);
                    setBuyTokenSrc(tickerSrc);
                  }}
                />
              }
            />
          )}
          {activeTab === TradingTab.SELL && (
            <Input
              classNames={{
                input: "ml-10 appearance-none",
                inputWrapper: ["h-[55px] bg-dark data-[hover=true]:bg-dark data-[focus=true]:bg-dark"],
              }}
              placeholder="0.0"
              value={sellAmount}
              onChange={handleSellAmountChange}
              type="text"
              radius="full"
              startContent={
                <span className="flex items-center gap-2">
                  <Image
                    className="h-[35px] w-[35px] rounded-3xl cursor-pointer"
                    src={token.image}
                    alt="ticker"
                    width={35}
                    height={35}
                  />
                  <p className="uppercase">${token.ticker}</p>
                </span>
              }
            />
          )}
          <div className="flex items-center pl-4 gap-2">
            {showPresets && (
              <button
                onClick={() => (activeTab === TradingTab.BUY ? setBuyAmount("") : setSellAmount(""))}
                className="flex items-center justify-center bg-dark rounded-2xl p-2"
              >
                <Image src="/reset.svg" alt="reset" width={10} height={10} />
              </button>
            )}
            {activeTab === TradingTab.BUY &&
              showPresets &&
              PURCHASE_AMOUNTS.map(amount => (
                <button
                  key={amount}
                  onClick={() => setBuyAmount(amount)}
                  className={`flex items-center justify-center p-2 text-sm w-[45px] h-[25px] rounded-2xl ${
                    amount === buyAmount ? "bg-gray" : "bg-dark"
                  }`}
                >
                  {amount}
                </button>
              ))}
            {activeTab === TradingTab.SELL &&
              SELL_AMOUNTS.map(amount => (
                <button
                  key={amount}
                  onClick={() => setSellAmount(tokensByPercentage(amount, ownedAmount))}
                  className={`flex items-center justify-center p-2 text-sm w-[45px] h-[25px] rounded-2xl ${
                    tokensByPercentage(amount, ownedAmount) === sellAmount ? "bg-gray" : "bg-dark"
                  }`}
                >
                  {amount}%
                </button>
              ))}
          </div>
          <button
            onClick={() => (activeTab === TradingTab.BUY ? buyTokens() : sellTokens())}
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
