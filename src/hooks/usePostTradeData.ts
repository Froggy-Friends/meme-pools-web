import { Address } from "viem";
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
          e instanceof EventLog && e.fragment.name === ContractEvent.TokenBought
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
          e instanceof EventLog && e.fragment.name === ContractEvent.TokenSold
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

    try {
      if (activeTab === TradingTab.BUY) {
        const { tokenAddress, buyer, amount, price, cost } =
          await getBuyTokenDetails(receipt);
        await addTrade(tokenAddress, buyer, "buy", price, amount, "eth", "eth");
      } else {
        const { tokenAddress, seller, amount, price, payout } =
          await getSellTokenDetails(receipt);
        await addTrade(
          tokenAddress,
          seller,
          "sell",
          price,
          amount,
          "eth",
          "eth"
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    activeTab,
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
