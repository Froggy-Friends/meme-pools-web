import { Address } from "viem";
import { ContractTransactionReceipt, formatUnits } from "ethers";
import { EventLog, TransactionReceipt } from "ethers";
import { TokensBought, TokensSold } from "@/types/token/types";
import { addTrade } from "@/actions/token/actions";
import { TradingTab } from "@/components/swap/Swap";
import { useCallback } from "react";
import { ContractEvent } from "@/models/contractEvent";

export default function usePostTradeData(activeTab: TradingTab, ethPrice: number) {
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
    async (receipt: ContractTransactionReceipt) => {
      if (!receipt) return;

      try {
        if (activeTab === TradingTab.BUY) {
          const { tokenAddress, buyer, amount, price, cost } =
            await getBuyTokenDetails(receipt);

          const formattedPrice = Number(formatUnits(BigInt(price))) * ethPrice;
          const nativeCost = Number(formatUnits(BigInt(cost)));
          const usdCost = Number(formatUnits(BigInt(cost))) * ethPrice;

          await addTrade(
            tokenAddress,
            buyer,
            "buy",
            formattedPrice,
            amount,
            nativeCost,
            usdCost,
            "eth",
            "eth",
            receipt.hash as Address
          );
        } else {
          const { tokenAddress, seller, amount, price, payout } =
            await getSellTokenDetails(receipt);
          const cost = amount * price;
          const nativeCost = Number(formatUnits(BigInt(cost)));
          const usdCost = Number(formatUnits(BigInt(cost))) * ethPrice;
          const formattedPrice = Number(formatUnits(BigInt(price))) * ethPrice;

          await addTrade(
            tokenAddress,
            seller,
            "sell",
            formattedPrice,
            amount,
            nativeCost,
            usdCost,
            "eth",
            "eth",
            receipt.hash as Address
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
    [activeTab, getBuyTokenDetails, getSellTokenDetails, ethPrice]
  );

  return { postTradeData };
}
