import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { CreateTokenParams, TokenCreated } from "@/types/token/types";
import { Contract, ContractTransactionReceipt, EventLog } from "ethers";
import { toast } from "react-hot-toast";
import { ContractEvent } from "@/models/contractEvent";

export default function useCreateToken() {
  const signer = useEthersSigner();
  const contract = new Contract(contractAddress, frogFunAbi, signer);

  const getTokenDetails = async (
    receipt: ContractTransactionReceipt
  ): Promise<TokenCreated> => {
    const event = receipt.logs.find(
      (e) => e instanceof EventLog && e.fragment.name === ContractEvent.TokenCreated
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
  }: CreateTokenParams) => {
    try {
      const [price, cost, fee, total] = await contract.calculateReservePrice(
        reservedAmount
      );
      const tx = await contract.createToken(name, symbol, reservedAmount, {
        value: total,
      });
      const txHash = tx.hash;
      const receipt = await tx.wait();

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
      console.log(error);
      toast.error("Launch token failed");
    }
  };

  return {
    createToken,
  };
}
