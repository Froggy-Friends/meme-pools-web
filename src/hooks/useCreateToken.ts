import { memepoolsAbi } from "@/abi/memepools";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { CreateTokenParams, TokenCreated, TxStatus } from "@/types/token/types";
import { Contract, ContractTransactionReceipt, EventLog } from "ethers";
import { toast } from "react-hot-toast";
import { ContractEvent } from "@/models/contractEvent";
import * as Sentry from "@sentry/react";
import { useState } from "react";
import { useChain } from "@/context/chain";
import { getContractAddress } from "@/lib/chains";

export default function useCreateToken() {
  const signer = useEthersSigner();
  const { chain } = useChain();
  const contractAddress = getContractAddress(chain.name);
  const contract = new Contract(contractAddress, memepoolsAbi, signer);
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);

  const getTokenDetails = async (
    receipt: ContractTransactionReceipt
  ): Promise<TokenCreated> => {
    const event = receipt.logs.find(
      (e) =>
        e instanceof EventLog && e.fragment.name === ContractEvent.TokenCreated
    ) as EventLog;

    const [tokenAddress, creator, name, symbol, reserved] = event.args;

    return {
      tokenAddress,
      creator,
      name,
      symbol,
      reserved,
    };
  };

  const createToken = async ({
    reservedAmount,
    name,
    symbol,
    autoLaunch,
  }: CreateTokenParams) => {
    setTxStatus("idle");

    try {
      const [price, cost, fee, total] = await contract.calculateReservePrice(
        reservedAmount
      );
      const tx = await contract.createToken(
        name,
        symbol,
        reservedAmount,
        autoLaunch,
        {
          value: total,
        }
      );
      setTxStatus("pending");
      setTxHash(tx.hash);
      const txHash = tx.hash;
      const receipt = await tx.wait();
      setTxStatus("completed");
      const { creator, reserved, tokenAddress } = await getTokenDetails(
        receipt
      );

      return {
        tokenAddress,
        creator,
        name,
        symbol,
        reserved,
        txHash,
      };
    } catch (error) {
      setTxStatus("error");
      Sentry.captureException(error);
      toast.error("Launch token failed");
    }
  };

  return {
    createToken,
    txStatus,
    txHash,
  };
}
