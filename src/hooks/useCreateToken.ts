import { frogFunAbi } from "@/abi/frogFun";
import { useEthersSigner } from "@/config/base/wagmi-ethers";
import { CreateTokenParams, TokenCreated } from "@/types/token/types";
import { Contract, ContractTransactionReceipt, EventLog } from "ethers";
import { toast } from "react-hot-toast";

export default function useCreateToken() {
  const signer = useEthersSigner();
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contract = new Contract(address!, frogFunAbi, signer);

  const getTokenDetails = async (
    receipt: ContractTransactionReceipt
  ): Promise<TokenCreated> => {
    const event = receipt.logs.find(
      (e) => e instanceof EventLog && e.fragment.name === "TokenCreated"
    ) as EventLog;
    const [creator, tokenId, reserved, tokenAddress] = event.args;
    return {
      creator,
      tokenId,
      reserved,
      tokenAddress,
    };
  };

  const createToken = async ({
    reservedAmount,
    name,
    symbol,
  }: CreateTokenParams) => {
    try {
      const tx = await contract.createToken(reservedAmount, name, symbol);
      const receipt = await tx.wait();
      const { creator, tokenId, reserved, tokenAddress } =
        await getTokenDetails(receipt);
      return {
        creator,
        tokenId,
        reserved,
        tokenAddress,
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
