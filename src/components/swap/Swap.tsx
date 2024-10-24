"use client";

import { defualtPriorityFee, defaultSlippagePercent } from "@/config/eth/token";
import { ChangeEvent, useEffect, useState } from "react";
import SlippageModal from "../token/SlippageModal";
import Image from "next/image";
import { useChain } from "@/context/chain";
import useBuyToken from "@/hooks/useBuyToken";
import { Address, parseUnits } from "viem";
import { formatUnits } from "ethers";
import { TokenWithVoteCount } from "@/types/token/types";
import useBuyPrice from "@/hooks/useBuyPrice";
import { Input, useDisclosure } from "@nextui-org/react";
import TokenSwitcher from "../token/TokenSwitcher";
import { wagmiChains } from "@/config/wagmi";
import useEthBalance from "@/hooks/useEthBalance";
import useTokenBalance from "@/hooks/useTokenBalance";
import SwapModal from "./SwapModal";
import { ethLogo, solanaLogo } from "@/config/chains";
import usePostTradeData from "@/hooks/usePostTradeData";
import { useDebouncedCallback } from "use-debounce";
import { Chain } from "@/models/chain";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import useSellToken from "@/hooks/useSellToken";
import useSellPrice from "@/hooks/useSellPrice";
import { formatTicker } from "@/lib/formatTicker";
import useAllowance from "@/hooks/useAllowance";
import useApproveToken from "@/hooks/useApproveToken";
import { formatNumber } from "@/lib/format";
import { useAccount } from "wagmi";

export enum TradingTab {
  BUY,
  SELL,
}

type TradingWidgetProps = {
  token: TokenWithVoteCount;
  currPrice: number;
  ethPrice: number;
};

const PURCHASE_AMOUNTS = [1, 2, 3, 4];
const SELL_AMOUNTS = [25, 50, 75, 100];
const rule = /^\d*\.?\d{0,18}$/; // Regex to match numbers with up to 18 decimal places

export default function Swap({ token, currPrice, ethPrice }: TradingWidgetProps) {
  const { ticker, tokenAddress } = token;
  const { chain } = useChain();
  const { isConnected } = useAccount();
  const {
    isOpen: isSwapModalOpen,
    onOpen: onSwapModalOpen,
    onOpenChange: onSwapModalOpenChange,
    onClose: onSwapModalClose,
  } = useDisclosure();
  const [activeTab, setActiveTab] = useState(TradingTab.BUY);
  const [buyAmount, setBuyAmount] = useState("");
  const [buyCost, setBuyCost] = useState<bigint>(BigInt(0));
  const [buyLoading, setBuyLoading] = useState(false);
  const [sellAmount, setSellAmount] = useState("");
  const [sellPayout, setSellPayout] = useState<bigint>(BigInt(0));
  const [buyTokenName, setBuyTokenName] = useState(token.ticker);
  const [buyTokenSrc, setBuyTokenSrc] = useState(token.image);
  const [slippagePercent, setSlippagePercent] = useState<number>(defaultSlippagePercent);
  const [priorityFee, setPriorityFee] = useState<number>(defualtPriorityFee);
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const { buyToken, buyTxStatus, buyTxHash } = useBuyToken(onSwapModalClose);
  const buyPrice = useBuyPrice();
  const { sellToken, sellTxStatus, sellTxHash } = useSellToken(onSwapModalClose);
  const getSellPrice = useSellPrice();
  const ethBalance = useEthBalance(wagmiChains.eth.id);
  const { tokenBalance, refetchBalance } = useTokenBalance(token.tokenAddress as Address, wagmiChains.eth.id);
  const { isApproved, refetchAllowance } = useAllowance(token.tokenAddress as Address, wagmiChains.eth.id);
  const { postTradeData } = usePostTradeData();
  const { approveToken } = useApproveToken(tokenAddress);
  // setBuyAmount(prevEthAmount => (prevEthAmount * ethPrice) / currPrice);

  const debouncedBuyCost = useDebouncedCallback(async (amount: string) => {
    if (amount === "") {
      setBuyCost(BigInt(0));
      return;
    }
    const buyAmountWei = parseUnits(amount, 18);
    const totalCost = await buyPrice(tokenAddress, buyAmountWei);
    setBuyCost(totalCost);
  }, 700);

  const debouncedSellPayout = useDebouncedCallback(async (amount: string) => {
    if (amount === "") {
      setSellPayout(BigInt(0));
      return;
    }
    const sellAmountWei = parseUnits(amount, 18);
    const totalPayout = await getSellPrice(tokenAddress, sellAmountWei);
    setSellPayout(totalPayout);
  }, 700);

  const handleBuyAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "" || rule.test(inputValue)) {
      setBuyAmount(inputValue);
      debouncedBuyCost(inputValue);
    }
  };

  const handleSellAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "" || rule.test(inputValue)) {
      setSellAmount(inputValue);
      debouncedSellPayout(inputValue);
    }
  };

  const tokensByPercentage = (amount: number, totalOwned: number) => {
    const tokens = amount * 0.01 * totalOwned;
    return tokens.toString();
  };

  const resetAmounts = () => {
    if (activeTab === TradingTab.BUY) {
      setBuyAmount("");
      debouncedBuyCost("");
    } else {
      setSellAmount("");
      debouncedSellPayout("");
    }
  };

  const buyTokens = async () => {
    const buyAmountWei = parseUnits(buyAmount, 18);
    onSwapModalOpen();
    const receipt = await buyToken(tokenAddress, buyAmountWei, buyCost);
    setBuyAmount("");
    setBuyCost(BigInt(0));
    await postTradeData(receipt, TradingTab.BUY, ethPrice);
    await refetchBalance();
    await refetchAllowance();
    if (!isApproved) {
      await approveToken();
    }
  };

  const sellTokens = async () => {
    const formattedSellAmount = parseUnits(sellAmount, 18);
    onSwapModalOpen();
    if (!isApproved) {
      await approveToken();
    }
    const receipt = await sellToken(tokenAddress, formattedSellAmount);
    setSellAmount("");
    setSellPayout(BigInt(0));
    await postTradeData(receipt, TradingTab.SELL, ethPrice);
    await refetchBalance();
    await refetchAllowance();
  };

  return (
    <>
      <div className="flex flex-col rounded-lg w-full laptop:w-[350px] mt-7">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab(TradingTab.BUY);
                setBuyAmount("");
              }}
              className={`w-[65px] h-[35px] rounded-3xl font-bold ${
                activeTab === TradingTab.BUY
                  ? "bg-green text-black"
                  : "bg-dark-gray text-white hover:bg-gray transition"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => {
                setActiveTab(TradingTab.SELL);
                setSellAmount("");
              }}
              className={`w-[65px] h-[35px] rounded-3xl font-bold text-white ${
                activeTab === TradingTab.SELL ? "bg-red" : "bg-dark-gray hover:bg-gray transition"
              }`}
            >
              Sell
            </button>
          </div>
          <button className="flex justify-center items-center w-[65px] h-[35px] rounded-3xl bg-dark-gray">
            <Image src="/setting.svg" alt="slippage" height={20} width={20} />
          </button>
        </div>
        <div className="relative flex flex-col justify-between gap-2 p-4 mt-4 rounded-3xl bg-dark-gray w-full h-[240px]">
          {activeTab === TradingTab.BUY && (
            <>
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
                autoComplete="off"
                startContent={
                  <TokenSwitcher
                    imgName={formatTicker(buyTokenName)}
                    imgSrc={buyTokenSrc}
                    token={token}
                    onChange={(ticker, tickerSrc) => {
                      setBuyTokenName(ticker);
                      setBuyTokenSrc(tickerSrc);
                    }}
                  />
                }
              />
              <div className="absolute left-1/2 top-[32%] transform -translate-x-1/2 -translate-y-1/2 bg-dark rounded-full">
                <FaRegArrowAltCircleDown size={24} className="text-gray" />
              </div>
              <div className="flex items-center gap-2 p-2 rounded-3xl bg-dark w-full">
                <Image
                  src={chain.name === Chain.Solana ? solanaLogo : ethLogo}
                  alt="eth"
                  width={35}
                  height={35}
                  className="ml-2"
                />
                <p>{chain.name === Chain.Solana ? "$SOL" : "$ETH"}</p>
                <p className="text-light-gray text-sm ml-2">
                  {buyCost !== BigInt(0) ? Number(formatUnits(buyCost)).toFixed(6) : "0.0"}
                </p>
              </div>
            </>
          )}
          {activeTab === TradingTab.SELL && (
            <>
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
                autoComplete="off"
                startContent={
                  <TokenSwitcher
                    imgName={formatTicker(token.ticker)}
                    imgSrc={token.image}
                    token={token}
                    onChange={(ticker, tickerSrc) => {
                      setBuyTokenName(ticker);
                      setBuyTokenSrc(tickerSrc);
                    }}
                  />
                }
              />
              <div className="absolute left-1/2 top-[32%] transform -translate-x-1/2 -translate-y-1/2 bg-dark rounded-full">
                <FaRegArrowAltCircleDown size={24} className="text-gray" />
              </div>
              <div className="flex items-center gap-2 p-2 rounded-3xl bg-dark w-full">
                <Image
                  src={chain.name === Chain.Solana ? solanaLogo : ethLogo}
                  alt="eth"
                  width={35}
                  height={35}
                  className="ml-2"
                />
                <p>{chain.name === Chain.Solana ? "$SOL" : "$ETH"}</p>
                <p className="text-light-gray text-sm ml-2">
                  {sellPayout !== BigInt(0) ? Number(formatUnits(sellPayout)).toFixed(6) : "0.0"}
                </p>
              </div>
            </>
          )}
          <div className="flex items-center pl-2 gap-2">
            <button
              onClick={() => resetAmounts()}
              className="flex items-center justify-center bg-dark rounded-2xl p-2 hover:bg-light-gray transition"
            >
              <Image src="/reset.svg" alt="reset" width={10} height={10} />
            </button>

            {activeTab === TradingTab.BUY &&
              showPresets &&
              PURCHASE_AMOUNTS.map(amount => (
                <button
                  key={amount}
                  onClick={() => setBuyAmount(amount.toString())}
                  disabled={!isConnected}
                  className={`flex items-center justify-center p-2 text-sm w-[45px] h-[25px] rounded-2xl ${
                    amount.toString() === buyAmount ? "bg-gray" : "bg-dark"
                  }`}
                >
                  {amount}
                </button>
              ))}
            {activeTab === TradingTab.SELL &&
              SELL_AMOUNTS.map(amount => (
                <button
                  key={amount}
                  disabled={!isConnected}
                  onClick={() => {
                    setSellAmount(tokensByPercentage(amount, tokenBalance));
                    debouncedSellPayout(tokensByPercentage(amount, tokenBalance));
                  }}
                  className={`flex items-center justify-center p-2 text-sm w-[45px] h-[25px] rounded-2xl transition ${
                    tokensByPercentage(amount, tokenBalance) === sellAmount
                      ? "bg-gray hover:bg-gray cursor-default"
                      : "bg-dark hover:bg-light-gray"
                  }`}
                >
                  {amount}%
                </button>
              ))}
          </div>
          <button
            onClick={() => (activeTab === TradingTab.BUY ? buyTokens() : sellTokens())}
            disabled={activeTab === TradingTab.BUY ? buyAmount === "" : sellAmount === "" || !isConnected}
            className={`flex items-center justify-center w-full h-[40px] p-4 rounded-3xl text-lg font-proximaSoftBold hover:bg-opacity-80 disabled:bg-gray active:scale-[0.98] transition ${
              activeTab === TradingTab.BUY
                ? "bg-green text-black hover:bg-light-green"
                : "bg-red text-white hover:bg-rose"
            }`}
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
      <SwapModal
        fromImageUrl={activeTab === TradingTab.BUY ? ethLogo : token.image}
        fromAmount={
          activeTab === TradingTab.BUY ? Number(formatUnits(buyCost, 18)).toFixed(6) : formatNumber(Number(sellAmount))
        }
        fromTicker={activeTab === TradingTab.BUY ? "ETH" : token.ticker}
        toImageUrl={activeTab === TradingTab.SELL ? ethLogo : token.image}
        toAmount={
          activeTab === TradingTab.BUY ? formatNumber(Number(buyAmount)) : Number(formatUnits(sellPayout)).toFixed(6)
        }
        toTicker={activeTab === TradingTab.BUY ? token.ticker : "ETH"}
        isOpen={isSwapModalOpen}
        onOpenChange={onSwapModalOpenChange}
        txStatus={activeTab === TradingTab.BUY ? buyTxStatus : sellTxStatus}
        txHash={activeTab === TradingTab.BUY ? buyTxHash : sellTxHash}
      />
    </>
  );
}
