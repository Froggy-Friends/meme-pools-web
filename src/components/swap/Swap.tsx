"use client";

import { defualtPriorityFee, defaultSlippagePercent } from "@/config/eth/token";
import { ChangeEvent, useState } from "react";
import SlippageModal from "../token/SlippageModal";
import Image from "next/image";
import { useChain } from "@/context/chain";
import useBuyToken from "@/hooks/useBuyToken";
import { Address, formatEther, parseEther, parseUnits } from "viem";
import { ContractTransactionReceipt, formatUnits } from "ethers";
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
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import useSellToken from "@/hooks/useSellToken";
import useSellPrice from "@/hooks/useSellPrice";
import { formatTicker } from "@/lib/formatTicker";
import useAllowance from "@/hooks/useAllowance";
import useApproveToken from "@/hooks/useApproveToken";
import { formatNumber } from "@/lib/format";
import { useAccount } from "wagmi";
import useTokenInfo from "@/hooks/useTokenInfo";
import { formatBalance } from "@/lib/formatBalance";

export enum TradingTab {
  BUY,
  SELL,
}

type TradingWidgetProps = {
  token: TokenWithVoteCount;
  currPrice: number;
  ethPrice: number;
};

const PURCHASE_AMOUNTS_ETH = [0.25, 0.5, 0.75, 1];
const PURCHASE_AMOUNTS_TOKENS = [1, 2.5, 5, 10];
const SELL_AMOUNTS = [25, 50, 75, 100];
const rule = /^[\d,]*\.?\d{0,18}$/; // Regex to match numbers with up to 18 decimal places

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
  const [buyTokensReceived, setBuyTokensReceived] = useState("");
  const [buyCost, setBuyCost] = useState<bigint>(BigInt(0));
  const [buyLoading, setBuyLoading] = useState(false);
  const [sellAmount, setSellAmount] = useState("");
  const [sellPayout, setSellPayout] = useState<bigint>(BigInt(0));
  const [buyTokenName, setBuyTokenName] = useState("ETH");
  const [buyTokenSrc, setBuyTokenSrc] = useState(ethLogo);
  const [slippagePercent, setSlippagePercent] = useState<number>(defaultSlippagePercent);
  const [priorityFee, setPriorityFee] = useState<number>(defualtPriorityFee);
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const { buyToken, buyTxStatus, buyTxHash, setBuyTxHash } = useBuyToken(onSwapModalClose);
  const { buyPriceTokens, buyPriceEth } = useBuyPrice();
  const { sellToken, sellTxStatus, sellTxHash, setSellTxHash } = useSellToken(onSwapModalClose);
  const getSellPrice = useSellPrice();
  const ethBalance = useEthBalance(wagmiChains.eth.id);
  const { tokenBalance, refetchBalance } = useTokenBalance(token.tokenAddress as Address, wagmiChains.eth.id);
  const { tokenInfo, refetchTokenInfo } = useTokenInfo(token);
  const { isApproved, refetchAllowance } = useAllowance(token.tokenAddress as Address, wagmiChains.eth.id);
  const { postTradeData } = usePostTradeData();
  const { approveToken, approveTxStatus, setApproveTxStatus, approveTxHash, setApproveTxHash } = useApproveToken(
    tokenAddress,
    onSwapModalClose
  );
  const [isTokenSwitcherOpen, setIsTokenSwitcherOpen] = useState(false);
  // setBuyAmount(prevEthAmount => (prevEthAmount * ethPrice) / currPrice);

  const debouncedBuyCost = useDebouncedCallback(async (amount: string) => {
    if (amount === "") {
      setBuyCost(BigInt(0));
      return;
    }

    if (buyTokenName === "ETH") {
      const totalTokens = await buyPriceEth(tokenAddress, amount);
      setBuyTokensReceived(formatUnits(totalTokens, 18));
    } else {
      const buyAmountWei = parseUnits(amount, 18);
      const totalCost = await buyPriceTokens(tokenAddress, buyAmountWei);
      setBuyCost(totalCost);
    }
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
    const inputValue = e.target.value.replace(/,/g, "");

    if (inputValue === "" || rule.test(inputValue)) {
      setBuyAmount(inputValue);
      setBuyTokensReceived("");
      debouncedBuyCost(inputValue);
    }
  };

  const handleSellAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/,/g, "");

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

  const handleSwapModalClose = () => {
    onSwapModalClose();
    setBuyAmount("");
    setSellAmount("");
    setBuyCost(BigInt(0));
    setSellPayout(BigInt(0));
    setApproveTxStatus("idle");
    setApproveTxHash(null);
    setBuyTxHash(null);
    setSellTxHash(null);
  };

  const buyTokens = async () => {
    let receipt: ContractTransactionReceipt;

    if (buyTokenName === "ETH") {
      const buyAmountWei = parseUnits(buyTokensReceived, 18);
      onSwapModalOpen();
      receipt = await buyToken(tokenAddress, buyAmountWei, parseEther(buyAmount));
    } else {
      const buyAmountWei = parseUnits(buyAmount, 18);
      onSwapModalOpen();
      receipt = await buyToken(tokenAddress, buyAmountWei, buyCost);
    }
    await postTradeData(receipt, TradingTab.BUY, ethPrice);
    await refetchBalance();
    await refetchAllowance();
    await refetchTokenInfo();
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
    await postTradeData(receipt, TradingTab.SELL, ethPrice);
    await refetchBalance();
    await refetchAllowance();
    await refetchTokenInfo();
  };

  return (
    <>
      <div className="flex flex-col rounded-lg w-full laptop:w-[350px] mt-7" id="swap">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab(TradingTab.BUY);
                setBuyAmount("");
              }}
              className={`w-[65px] h-[35px] rounded-xl font-proximaNovaBold ${
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
              className={`w-[65px] h-[35px] rounded-xl font-proximaNovaBold text-white ${
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
        <div className="relative flex flex-col justify-between gap-2 py-4 px-5 mt-4 rounded-3xl bg-dark-gray w-full min-h-[240px]">
          {activeTab === TradingTab.BUY && (
            <>
              <Input
                classNames={{
                  input: "ml-12 appearance-none",
                  inputWrapper: ["h-[70px] px-4 bg-dark data-[hover=true]:bg-dark data-[focus=true]:bg-dark"],
                }}
                placeholder="0.0"
                value={
                  buyAmount && buyTokenName !== "ETH"
                    ? formatNumber(Math.round(Number(buyAmount)))
                    : buyAmount && buyTokenName === "ETH"
                    ? buyAmount
                    : ""
                }
                onChange={handleBuyAmountChange}
                type="text"
                radius="lg"
                autoComplete="off"
                startContent={
                  <TokenSwitcher
                    imgName={buyTokenName}
                    imgSrc={buyTokenSrc}
                    token={token}
                    isOpen={isTokenSwitcherOpen}
                    setIsOpen={setIsTokenSwitcherOpen}
                    onChange={(ticker, tickerSrc) => {
                      setBuyTokenName(ticker);
                      setBuyTokenSrc(tickerSrc);
                    }}
                    balance={
                      buyTokenName === "ETH" ? Number(formatEther(ethBalance?.value || BigInt(0))) : tokenBalance
                    }
                  />
                }
              />
              <div className="absolute top-[3.25rem] left-[1.125rem] transform -translate-y-1/2">
                <MdOutlineKeyboardArrowDown
                  size={20}
                  className={`text-light-gray transition-transform duration-200 ${
                    isTokenSwitcherOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div className="absolute left-1/2 top-[35%] transform -translate-x-1/2 -translate-y-1/2 bg-dark rounded-full">
                <FaRegArrowAltCircleDown size={24} className="text-gray" />
              </div>
              <div className="h-[70px] flex items-center gap-2 p-2 rounded-xl bg-dark w-full">
                <Image
                  src={
                    (chain.name === Chain.Solana && buyTokenName === "SOL") ||
                    (chain.name === Chain.Eth && buyTokenName === "ETH")
                      ? token.image
                      : chain.name === Chain.Solana
                      ? solanaLogo
                      : ethLogo
                  }
                  alt="eth"
                  width={35}
                  height={35}
                  className="ml-2 rounded-full"
                />
                <p>
                  {(chain.name === Chain.Solana && buyTokenName === "SOL") ||
                  (chain.name === Chain.Eth && buyTokenName === "ETH")
                    ? `$${formatTicker(token.ticker)}`
                    : chain.name === Chain.Solana
                    ? "$SOL"
                    : "$ETH"}
                </p>
                {buyTokenName !== "ETH" && (
                  <p className="text-light-gray text-sm ml-4">
                    {buyCost !== BigInt(0) ? Number(formatUnits(buyCost)).toFixed(6) : "0.0"}
                  </p>
                )}
                {buyTokenName === "ETH" && (
                  <p className="text-light-gray text-sm ml-4">
                    {buyTokenName === "ETH" && buyTokensReceived !== "" && buyAmount !== ""
                      ? formatNumber(Math.round(Number(buyTokensReceived)))
                      : "0.0"}
                  </p>
                )}
              </div>
            </>
          )}
          {activeTab === TradingTab.SELL && (
            <>
              <Input
                classNames={{
                  input: "ml-[3.25rem] appearance-none",
                  inputWrapper: ["h-[70px] px-4 bg-dark data-[hover=true]:bg-dark data-[focus=true]:bg-dark"],
                }}
                placeholder="0.0"
                value={sellAmount ? formatNumber(Math.round(Number(sellAmount))) : ""}
                onChange={handleSellAmountChange}
                type="text"
                radius="lg"
                autoComplete="off"
                startContent={
                  <div className="flex items-center gap-2">
                    <Image src={token.image} alt={token.name} height={35} width={35} className="rounded-full" />
                    <p className="uppercase mb-3">${formatTicker(token.ticker)}</p>
                  </div>
                }
              />
              <div className="absolute left-1/2 top-[35%] transform -translate-x-1/2 -translate-y-1/2 bg-dark rounded-full">
                <FaRegArrowAltCircleDown size={24} className="text-gray" />
              </div>

              <div className="absolute top-[20.5%] left-[4.9rem]">
                <div className="flex items-center gap-x-1">
                  <p className="text-light-gray text-xs">
                    <FaWallet size={12} />
                  </p>
                  <p className="text-light-gray text-xs">{formatBalance(Math.round(Number(tokenBalance || 0)))}</p>
                </div>
              </div>

              <div className="h-[70px] flex items-center gap-2 p-2 rounded-xl bg-dark w-full">
                <Image
                  src={chain.name === Chain.Solana ? solanaLogo : ethLogo}
                  alt="eth"
                  width={35}
                  height={35}
                  className="ml-2"
                />
                <p>{chain.name === Chain.Solana ? "$SOL" : "$ETH"}</p>
                <p className="text-light-gray text-sm ml-4">
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
              buyTokenName === "ETH" &&
              PURCHASE_AMOUNTS_ETH.map(amount => (
                <button
                  key={amount}
                  onClick={() => {
                    setBuyAmount(amount.toString());
                    debouncedBuyCost(amount.toString());
                  }}
                  disabled={!isConnected}
                  className={`flex items-center justify-center p-2 text-sm w-[45px] h-[25px] rounded-lg transition ${
                    amount.toString() === buyAmount
                      ? "bg-gray hover:bg-gray cursor-default"
                      : "bg-dark hover:bg-light-gray"
                  }`}
                >
                  {amount}
                </button>
              ))}
            {activeTab === TradingTab.BUY &&
              buyTokenName !== "ETH" &&
              PURCHASE_AMOUNTS_TOKENS.map(amount => (
                <button
                  key={amount}
                  onClick={() => {
                    tokenInfo &&
                      tokenInfo.availableSupply &&
                      setBuyAmount(
                        Math.round(Number(tokensByPercentage(amount, tokenInfo.availableSupply))).toString()
                      );
                    tokenInfo &&
                      tokenInfo.availableSupply &&
                      debouncedBuyCost(
                        Math.round(Number(tokensByPercentage(amount, tokenInfo.availableSupply))).toString()
                      );
                  }}
                  disabled={!isConnected}
                  className={`flex items-center justify-center p-2 text-sm w-[45px] h-[25px] rounded-lg transition ${
                    amount.toString() === buyAmount
                      ? "bg-gray hover:bg-gray cursor-default"
                      : "bg-dark hover:bg-light-gray"
                  }`}
                >
                  {amount}%
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
                  className={`flex items-center justify-center p-2 text-sm w-[45px] h-[25px] rounded-lg transition ${
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
            className={`flex items-center justify-center w-full h-[40px] p-4 rounded-xl text-lg font-proximaNovaBold hover:bg-opacity-80 disabled:bg-gray active:scale-[0.98] transition ${
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
          activeTab === TradingTab.BUY && buyTokenName === "ETH"
            ? buyAmount
            : activeTab === TradingTab.BUY
            ? Number(formatUnits(buyCost, 18)).toFixed(6)
            : formatNumber(Math.round(Number(sellAmount)))
        }
        fromTicker={activeTab === TradingTab.BUY ? "ETH" : token.ticker}
        toImageUrl={activeTab === TradingTab.SELL ? ethLogo : token.image}
        toAmount={
          activeTab === TradingTab.BUY && buyTokenName === "ETH"
            ? formatNumber(Number(buyTokensReceived))
            : activeTab === TradingTab.BUY
            ? formatNumber(Number(buyAmount))
            : Number(formatUnits(sellPayout)).toFixed(6)
        }
        toTicker={activeTab === TradingTab.BUY ? token.ticker : "ETH"}
        isOpen={isSwapModalOpen}
        onOpenChange={onSwapModalOpenChange}
        txStatus={activeTab === TradingTab.BUY ? buyTxStatus : sellTxStatus}
        txHash={activeTab === TradingTab.BUY ? buyTxHash : sellTxHash}
        approveTxHash={approveTxHash}
        isApproved={isApproved}
        approveTxStatus={approveTxStatus}
        handleSwapModalClose={handleSwapModalClose}
        activeTab={activeTab}
      />
    </>
  );
}
