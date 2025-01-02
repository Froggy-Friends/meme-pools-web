import { Address } from "viem";
import { ContractTransactionReceipt, formatUnits } from "ethers";
import { EventLog, TransactionReceipt } from "ethers";
import { TokensBought, TokensSold } from "@/types/token/types";
import { addTrade } from "@/actions/token/actions";
import { TradingTab } from "@/components/swap/Swap";
import { useCallback } from "react";
import { ContractEvent } from "@/models/contractEvent";

export default function usePostTradeData() {
  const getBuyTokenDetails = useCallback(
    async (receipt: TransactionReceipt): Promise<TokensBought> => {
      const event = receipt.logs.find(
        (e) =>
          e instanceof EventLog &&
          e.fragment.name === ContractEvent.TokensBought
      ) as EventLog;
      const [tokenAddress, buyer, amount, price, cost] = event.args;

      return {
        tokenAddress,
        buyer,
        amount,
        price,
        cost,
      };
    },
    []
  );

  const getSellTokenDetails = useCallback(
    async (receipt: TransactionReceipt): Promise<TokensSold> => {
      const event = receipt.logs.find(
        (e) =>
          e instanceof EventLog && e.fragment.name === ContractEvent.TokensSold
      ) as EventLog;

      const [tokenAddress, seller, amount, price, payout] = event.args;

      return {
        tokenAddress,
        seller,
        amount,
        price,
        payout,
      };
    },
    []
  );

  const postTradeData = useCallback(
    async (
      receipt: ContractTransactionReceipt,
      activeTab: TradingTab,
      nativeTokenPrice: number,
      nativeToken: string,
      chain: string
    ) => {
      if (!receipt) return;

      try {
        if (activeTab === TradingTab.BUY) {
          const { tokenAddress, buyer, amount, price, cost } =
            await getBuyTokenDetails(receipt);

          const formattedPrice =
            Number(formatUnits(BigInt(price), 18)) * nativeTokenPrice;
          const nativeCost = Number(formatUnits(BigInt(cost), 18));
          const usdCost =
            Number(formatUnits(BigInt(cost), 18)) * nativeTokenPrice;
          const formattedAmount = Number(formatUnits(BigInt(amount), 18));

          await addTrade(
            tokenAddress,
            buyer,
            "buy",
            formattedPrice,
            formattedAmount,
            nativeCost,
            usdCost,
            nativeToken,
            chain,
            receipt.hash as Address
          );
        } else if (activeTab === TradingTab.SELL) {
          const { tokenAddress, seller, amount, price, payout } =
            await getSellTokenDetails(receipt);

          const formattedPrice =
            Number(formatUnits(BigInt(price), 18)) * nativeTokenPrice;
          const formattedAmount = Number(formatUnits(BigInt(amount), 18));
          const nativePayout = Number(formatUnits(BigInt(payout), 18));
          const usdPayout = nativePayout * nativeTokenPrice;

          await addTrade(
            tokenAddress,
            seller,
            "sell",
            formattedPrice,
            formattedAmount,
            nativePayout,
            usdPayout,
            nativeToken,
            chain,
            receipt.hash as Address
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
    [getBuyTokenDetails, getSellTokenDetails]
  );

  const postReserveData = useCallback(
    async (
      tokenAddress: string,
      buyer: string,
      cost: number,
      price: number,
      amount: number,
      nativeTokenPrice: number,
      nativeToken: string,
      chain: string,
      txHash: Address
    ) => {
      const formattedPrice =
        Number(formatUnits(BigInt(price), 18)) * nativeTokenPrice;
      const nativeCost = cost;
      const usdCost = cost * nativeTokenPrice;
      const formattedAmount = Number(formatUnits(BigInt(amount), 18));

      try {
        await addTrade(
          tokenAddress,
          buyer,
          "buy",
          formattedPrice,
          formattedAmount,
          nativeCost,
          usdCost,
          nativeToken,
          chain,
          txHash
        );
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  return {
    postTradeData,
    postReserveData,
    getBuyTokenDetails,
    getSellTokenDetails,
  };
}
