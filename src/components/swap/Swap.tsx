"use client";

import { defaultSlippagePercent } from "@/config/eth/token";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useChain } from "@/context/chain";
import useBuyToken from "@/hooks/useBuyToken";
import { Address, formatEther, parseUnits } from "viem";
import { ContractTransactionReceipt, formatUnits } from "ethers";
import { TokenWithVoteCount } from "@/types/token/types";
import useBuyPrice from "@/hooks/useBuyPrice";
import { Input } from "@nextui-org/react";
import TokenSwitcher from "../token/TokenSwitcher";
import { wagmiChains } from "@/config/reown";
import useEthBalance from "@/hooks/useEthBalance";
import useTokenBalance from "@/hooks/useTokenBalance";
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
import useMaxBuy from "@/hooks/useMaxBuy";
import {
  updateTokenIsClaimable,
  createClaimRecords,
  updateTokenMarketcap,
  updateTokenReadyForLp,
} from "@/actions/token/actions";
import SlippagePopover from "./SlippagePopover";

export enum TradingTab {
  BUY,
  SELL,
}

type TradingWidgetProps = {
  token: TokenWithVoteCount;
  ethPrice: number;
};

const PURCHASE_AMOUNTS_ETH = [0.01, 0.025, 0.05, 0.1];
const PURCHASE_AMOUNTS_TOKENS = [0.25, 0.5, 1, 2];
const SELL_AMOUNTS = [25, 50, 75, 100];
const rule = /^[\d,]*\.?\d{0,18}$/; // Regex to match numbers with up to 18 decimal places

export default function Swap({ token, ethPrice }: TradingWidgetProps) {
  const { ticker, tokenAddress } = token;
  const { chain } = useChain();
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState(TradingTab.BUY);
  const [buyAmount, setBuyAmount] = useState<bigint>(BigInt(0));
  const [buyTokensReceived, setBuyTokensReceived] = useState<bigint>(BigInt(0));
  const [buyCost, setBuyCost] = useState<bigint>(BigInt(0));
  const [buyInputValue, setBuyInputValue] = useState("");
  const [sellAmount, setSellAmount] = useState<bigint>(BigInt(0));
  const [sellPayout, setSellPayout] = useState<bigint>(BigInt(0));
  const [buyTokenName, setBuyTokenName] = useState("ETH");
  const [buyTokenSrc, setBuyTokenSrc] = useState(ethLogo);
  const [slippagePercent, setSlippagePercent] = useState<number>(defaultSlippagePercent);
  const { buyToken } = useBuyToken(token);
  const { buyPriceTokens, buyPriceEth } = useBuyPrice(token);
  const { sellToken } = useSellToken(token);
  const getSellPrice = useSellPrice(token);
  const { ethBalance, refetchEthBalance } = useEthBalance(wagmiChains.eth.id);
  const { tokenBalance, refetchBalance } = useTokenBalance(token.tokenAddress as Address, wagmiChains.eth.id);
  const { tokenInfo, refetchTokenInfo } = useTokenInfo(token);
  const { isApproved, refetchAllowance } = useAllowance(token, wagmiChains.eth.id);
  const { postTradeData } = usePostTradeData();
  const { approveToken } = useApproveToken(token);
  const { maxBuyPrice } = useMaxBuy(token);

  const insufficientBuyBalance =
    buyAmount !== BigInt(0) &&
    ethBalance &&
    (buyTokenName === "ETH"
      ? Number(buyAmount) > Number(ethBalance.value)
      : Number(buyCost) > Number(ethBalance.value));

  const insufficientSellBalance = sellAmount !== BigInt(0) && Number(sellAmount) > Number(tokenBalance);

  const debouncedBuyCost = useDebouncedCallback(async (amount: bigint) => {
    if (amount === BigInt(0)) {
      setBuyCost(BigInt(0));
      return;
    }

    if (buyTokenName === "ETH") {
      const totalTokens = await buyPriceEth(tokenAddress, amount);
      setBuyTokensReceived(totalTokens);
    } else {
      const totalCost = await buyPriceTokens(tokenAddress, amount);
      setBuyCost(totalCost);
    }
  }, 700);

  const debouncedSellPayout = useDebouncedCallback(async (amount: bigint) => {
    if (amount === BigInt(0)) {
      setSellPayout(BigInt(0));
      return;
    }
    const totalPayout = await getSellPrice(tokenAddress, amount);
    setSellPayout(totalPayout);
  }, 700);

  const handleBuyAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/,/g, "");

    if (inputValue === "" || rule.test(inputValue)) {
      setBuyInputValue(inputValue);
      setBuyAmount(parseUnits(inputValue, 18));
      setBuyTokensReceived(BigInt(0));
      debouncedBuyCost(parseUnits(inputValue, 18));
    }
  };

  const handleSellAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/,/g, "");

    if (inputValue === "" || rule.test(inputValue)) {
      setSellAmount(parseUnits(inputValue, 18));
      debouncedSellPayout(parseUnits(inputValue, 18));
    }
  };

  const tokensByPercentage = (amount: number, totalOwned: number) => {
    const tokens = Math.round(amount * 0.01 * totalOwned);
    return BigInt(tokens);
  };

  const resetAmounts = () => {
    setBuyAmount(BigInt(0));
    setBuyInputValue("");
    debouncedBuyCost(BigInt(0));
    setBuyTokensReceived(BigInt(0));
    setSellAmount(BigInt(0));
    debouncedSellPayout(BigInt(0));
  };

  const buyTokens = async () => {
    let receipt: ContractTransactionReceipt;
    const formattedSlippage = slippagePercent * 100;

    if (buyTokenName === "ETH") {
      receipt = await buyToken(token, buyTokensReceived, buyAmount, formattedSlippage);
    } else {
      receipt = await buyToken(token, buyAmount, buyCost, formattedSlippage);
    }
    await postTradeData(receipt, TradingTab.BUY, ethPrice);
    await refetchBalance();
    await refetchEthBalance();
    await refetchAllowance();
    const updatedTokenInfo = await refetchTokenInfo();
    await updateTokenMarketcap(token.id, updatedTokenInfo.data?.marketcap || 0);
    if (receipt) {
      resetAmounts();
    }
    if (!isApproved && receipt) {
      await approveToken();
      await refetchAllowance();
    }
    if (updatedTokenInfo.data?.readyForLp) {
      await updateTokenReadyForLp(token.id);
    }
  };

  const sellTokens = async () => {
    const formattedSlippage = slippagePercent * 100;
    if (!isApproved) {
      await approveToken();
      await refetchAllowance();
    }
    const receipt = await sellToken(token, sellAmount, sellPayout, formattedSlippage);
    await postTradeData(receipt, TradingTab.SELL, ethPrice);
    await refetchBalance();
    await refetchEthBalance();
    await refetchAllowance();
    const updatedTokenInfo = await refetchTokenInfo();
    await updateTokenMarketcap(token.id, updatedTokenInfo.data?.marketcap || 0);
    if (receipt) {
      resetAmounts();
    }
  };

  return (
    <>
      <div className="flex flex-col rounded-lg w-full laptop:w-[430px] mt-7" id="swap">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab(TradingTab.BUY);
                resetAmounts();
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
                resetAmounts();
              }}
              className={`w-[65px] h-[35px] rounded-xl font-proximaNovaBold text-white ${
                activeTab === TradingTab.SELL ? "bg-red" : "bg-dark-gray hover:bg-gray transition"
              }`}
            >
              Sell
            </button>
          </div>
          <SlippagePopover slippagePercent={slippagePercent} setSlippagePercent={setSlippagePercent} />
        </div>
        <div className="relative flex flex-col justify-between gap-2 py-4 px-5 mt-4 rounded-3xl bg-dark-gray w-full min-h-[240px]">
          {activeTab === TradingTab.BUY && (
            <>
              <Input
                classNames={{
                  input: "text-right appearance-none",
                  inputWrapper: [
                    "h-[70px] pl-7 pr-20 tablet:pr-24 bg-dark data-[hover=true]:bg-dark data-[focus=true]:bg-dark",
                  ],
                }}
                placeholder="0.0"
                value={
                  buyTokenName === "ETH" ? buyInputValue : formatNumber(Math.round(Number(formatEther(buyAmount))))
                }
                onChange={handleBuyAmountChange}
                type="text"
                radius="lg"
                autoComplete="off"
                startContent={
                  <div className="relative flex items-center gap-2">
                    <TokenSwitcher
                      imgName={buyTokenName}
                      imgSrc={buyTokenSrc}
                      token={token}
                      onChange={(ticker, tickerSrc) => {
                        setBuyTokenName(ticker);
                        setBuyTokenSrc(tickerSrc);
                        setBuyAmount(BigInt(0));
                        setBuyTokensReceived(BigInt(0));
                        setBuyCost(BigInt(0));
                      }}
                      balance={
                        buyTokenName === "ETH"
                          ? Number(formatEther(ethBalance?.value || BigInt(0)))
                          : Number(formatEther(tokenBalance as bigint))
                      }
                    />
                  </div>
                }
              />
              <div className="flex flex-col items-end absolute top-[3.4rem] right-[2.2rem] transform -translate-y-1/2">
                <button
                  disabled={!isConnected}
                  onClick={async () => {
                    const updatedTokenInfo = await refetchTokenInfo();
                    setBuyInputValue(
                      buyTokenName === "ETH"
                        ? formatEther((maxBuyPrice as bigint) || BigInt(0)).substring(0, 8) || "0"
                        : updatedTokenInfo?.data?.availableSupply.toString() || "0"
                    );
                    setBuyAmount(
                      buyTokenName === "ETH"
                        ? maxBuyPrice || BigInt(0)
                        : updatedTokenInfo?.data?.availableSupplyRaw || BigInt(0)
                    );
                    if (buyTokenName !== "ETH") {
                      debouncedBuyCost(updatedTokenInfo?.data?.availableSupplyRaw || BigInt(0));
                    } else {
                      setBuyTokensReceived(updatedTokenInfo?.data?.availableSupplyRaw || BigInt(0));
                    }
                  }}
                  className="text-black bg-primary rounded-3xl px-2 text-xs hover:bg-light-primary transition"
                >
                  MAX
                </button>
                <p className="text-light-gray text-xs whitespace-nowrap">
                  {tokenInfo?.readyForLp
                    ? "0.0 ETH"
                    : buyTokenName === "ETH"
                    ? Number(formatEther((maxBuyPrice as bigint) || BigInt(0))) < 0.01
                      ? ">0.01 ETH"
                      : `${Number(formatEther((maxBuyPrice as bigint) || BigInt(0))).toFixed(2) || 0.0} ETH`
                    : `${formatBalance(tokenInfo?.availableSupply || 0)}`}
                </p>
              </div>

              <div className="absolute top-[3.25rem] left-[1.5rem] transform -translate-y-1/2">
                <MdOutlineKeyboardArrowDown size={22} className="text-light-gray" />
              </div>
              <div className="absolute left-1/2 top-[35%] transform -translate-x-1/2 -translate-y-1/2 bg-dark rounded-full">
                <FaRegArrowAltCircleDown size={24} className="text-gray" />
              </div>
              <div className="h-[70px] flex items-center justify-between py-2 px-7 rounded-xl bg-dark w-full">
                <div className="flex items-center gap-2">
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
                    className="rounded-full w-[35px] h-[35px] object-cover"
                  />
                  <p>
                    {(chain.name === Chain.Solana && buyTokenName === "SOL") ||
                    (chain.name === Chain.Eth && buyTokenName === "ETH")
                      ? `$${formatTicker(token.ticker)}`
                      : chain.name === Chain.Solana
                      ? "$SOL"
                      : "$ETH"}
                  </p>
                </div>
                {buyTokenName !== "ETH" && (
                  <p className="text-light-gray text-sm mr-[3.25rem] tablet:mr-[4.25rem]">
                    {buyCost !== BigInt(0) ? Number(formatUnits(buyCost)).toFixed(6) : "0.0"}
                  </p>
                )}
                {buyTokenName === "ETH" && (
                  <p className="text-light-gray text-sm mr-[3.25rem] tablet:mr-[4.25rem]">
                    {buyTokenName === "ETH" && buyTokensReceived !== BigInt(0) && buyAmount !== BigInt(0)
                      ? formatNumber(Math.round(Number(formatEther(buyTokensReceived))))
                      : "0.0"}
                  </p>
                )}
              </div>
            </>
          )}
          {activeTab === TradingTab.SELL && (
            <>
              <Input
                disabled={tokenInfo?.readyForLp}
                classNames={{
                  input: "text-right appearance-none",
                  inputWrapper: ["h-[70px] px-7 bg-dark data-[hover=true]:bg-dark data-[focus=true]:bg-dark"],
                }}
                placeholder="0.0"
                value={sellAmount ? formatNumber(Math.round(Number(formatEther(sellAmount)))) : ""}
                onChange={handleSellAmountChange}
                type="text"
                radius="lg"
                autoComplete="off"
                startContent={
                  <div className="flex items-center gap-2">
                    <Image
                      src={token.image}
                      alt={token.name}
                      height={35}
                      width={35}
                      className="rounded-full w-[35px] h-[35px] object-cover"
                    />
                    <p className="uppercase mb-3">${formatTicker(token.ticker)}</p>
                  </div>
                }
              />
              <div className="absolute left-1/2 top-[35%] transform -translate-x-1/2 -translate-y-1/2 bg-dark rounded-full">
                <FaRegArrowAltCircleDown size={24} className="text-gray" />
              </div>

              <div className="absolute top-[20.5%] left-[5.7rem]">
                <div className="flex items-center gap-x-1">
                  <p className="text-light-gray text-xs">
                    <FaWallet size={12} />
                  </p>
                  <p className="text-light-gray text-xs">
                    {formatBalance(Number(formatEther(tokenBalance as bigint) || 0))}
                  </p>
                </div>
              </div>

              <div className="h-[70px] flex items-center justify-between py-2 px-7 rounded-xl bg-dark w-full">
                <div className="flex items-center gap-2">
                  <Image
                    src={chain.name === Chain.Solana ? solanaLogo : ethLogo}
                    alt="chain-logo"
                    width={35}
                    height={35}
                    className="rounded-full w-[35px] h-[35px] object-cover"
                  />
                  <p>{chain.name === Chain.Solana ? "$SOL" : "$ETH"}</p>
                </div>
                <p className="text-light-gray text-sm">
                  {sellPayout !== BigInt(0) ? Number(formatUnits(sellPayout)).toFixed(6) : "0.0"}
                </p>
              </div>
            </>
          )}
          <div className="flex items-center pl-2 gap-2">
            <button
              onClick={() => resetAmounts()}
              className="flex items-center justify-center bg-black rounded-2xl p-2 hover:bg-gray transition"
            >
              <Image src="/reset.svg" alt="reset" width={10} height={10} />
            </button>

            {activeTab === TradingTab.BUY &&
              buyTokenName === "ETH" &&
              PURCHASE_AMOUNTS_ETH.map(amount => (
                <button
                  key={amount}
                  onClick={() => {
                    setBuyInputValue(amount.toString());
                    setBuyAmount(parseUnits(amount.toString(), 18));
                    debouncedBuyCost(parseUnits(amount.toString(), 18));
                  }}
                  disabled={!isConnected}
                  className={`flex items-center justify-center p-2 text-sm w-[45px] h-[25px] rounded-lg transition ${
                    parseUnits(amount.toString(), 18) === buyAmount
                      ? "bg-black hover:bg-black cursor-default"
                      : "bg-black hover:bg-gray"
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
                      setBuyInputValue(tokensByPercentage(amount, Number(tokenInfo.availableSupply)).toString());
                    tokenInfo &&
                      tokenInfo.availableSupply &&
                      setBuyAmount(tokensByPercentage(amount, Number(tokenInfo.availableSupplyRaw)));
                    tokenInfo &&
                      tokenInfo.availableSupply &&
                      debouncedBuyCost(tokensByPercentage(amount, Number(tokenInfo.availableSupplyRaw)));
                  }}
                  disabled={!isConnected}
                  className={`flex items-center justify-center p-2 text-sm w-[45px] h-[25px] rounded-lg transition ${
                    parseUnits(amount.toString(), 18) === buyAmount
                      ? "bg-black hover:bg-black cursor-default"
                      : "bg-black hover:bg-gray"
                  }`}
                >
                  {amount}%
                </button>
              ))}
            {activeTab === TradingTab.SELL &&
              SELL_AMOUNTS.map(amount => (
                <button
                  key={amount}
                  disabled={!isConnected || tokenInfo?.readyForLp}
                  onClick={() => {
                    setSellAmount(
                      amount === 100 ? (tokenBalance as bigint) : tokensByPercentage(amount, Number(tokenBalance))
                    );
                    debouncedSellPayout(
                      amount === 100 ? (tokenBalance as bigint) : tokensByPercentage(amount, Number(tokenBalance))
                    );
                  }}
                  className={`flex items-center justify-center p-2 text-sm w-[45px] h-[25px] rounded-lg transition disabled:hover:bg-black ${
                    tokensByPercentage(amount, Number(tokenBalance)) === sellAmount
                      ? "bg-black hover:bg-black cursor-default"
                      : "bg-black hover:bg-gray"
                  }`}
                >
                  {amount}%
                </button>
              ))}
          </div>
          <button
            onClick={() => (activeTab === TradingTab.BUY ? buyTokens() : sellTokens())}
            disabled={
              !isConnected ||
              tokenInfo?.readyForLp ||
              (activeTab === TradingTab.BUY
                ? buyAmount === BigInt(0) || insufficientBuyBalance
                : sellAmount === BigInt(0) || insufficientSellBalance)
            }
            className={`flex items-center justify-center w-full h-[40px] p-4 rounded-xl text-lg font-proximaNovaBold hover:bg-opacity-80 disabled:bg-gray disabled:text-light-gray active:scale-[0.98] transition ${
              activeTab === TradingTab.BUY
                ? "bg-green text-black hover:bg-light-green"
                : "bg-red text-white hover:bg-rose"
            }`}
          >
            {activeTab === TradingTab.BUY && insufficientBuyBalance
              ? "Insufficient ETH"
              : activeTab === TradingTab.SELL && insufficientSellBalance
              ? "Insufficient Balance"
              : "TRADE"}
          </button>
        </div>
      </div>
    </>
  );
}
