import { Address } from "viem";
import { formatUnits } from "ethers";
import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress, rpcUrl } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import {
  Contract,
  ethers,
  EventLog,
  TransactionReceipt,
  UndecodedEventLog,
} from "ethers";
import { TokensBought, TokensSold } from "@/types/token/types";
import { addTrade } from "@/actions/token/actions";
import { TradingTab } from "@/components/swap/Swap";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { ContractEvent } from "@/models/contractEvent";
import getEthPrice from "@/lib/getEthPrice";

export default function usePostTradeData(
  txHash: Address,
  activeTab: TradingTab
) {
  const signer = useEthersSigner();
  const contract = new Contract(contractAddress, frogFunAbi, signer);
  const provider = useMemo(() => new ethers.JsonRpcProvider(rpcUrl), []);
  const { status } = useWaitForTransactionReceipt({ hash: txHash });
  const processedTxHashes = useRef<Set<string>>(new Set());

  const getEventLogs = useCallback(
    async (receipt: TransactionReceipt) => {
      return receipt.logs.map((log) => {
        const fragment = log.topics.length
          ? contract.interface.getEvent(log.topics[0])
          : null;
        if (fragment) {
          try {
            return new EventLog(log, contract.interface, fragment);
          } catch (error: any) {
            return new UndecodedEventLog(log, error);
          }
        }
      });
    },
    [contract.interface]
  );

  const getTransactionReceipt = useCallback(async () => {
    try {
      const receipt = await provider.getTransactionReceipt(txHash);
      return receipt;
    } catch (error) {
      console.error(error);
    }
  }, [txHash, provider]);

  const getBuyTokenDetails = useCallback(
    async (receipt: TransactionReceipt): Promise<TokensBought> => {
      const logs = await getEventLogs(receipt);
      const event = logs.find(
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
    [getEventLogs]
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

  const postTradeData = useCallback(async () => {
    const receipt = await getTransactionReceipt();
    if (!receipt) return;

    const ethPrice = await getEthPrice();

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
          txHash,
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
          txHash,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    activeTab,
    txHash,
    getTransactionReceipt,
    getBuyTokenDetails,
    getSellTokenDetails,
  ]);

  useEffect(() => {
    if (
      status === "success" &&
      txHash &&
      !processedTxHashes.current.has(txHash)
    ) {
      postTradeData().then(() => {
        processedTxHashes.current.add(txHash);
      });
    }
  }, [txHash, postTradeData, status]);
}
