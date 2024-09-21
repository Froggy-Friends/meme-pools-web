import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import toast from "react-hot-toast";


export default function useBuyToken() {
  const signer = useEthersSigner();
  const contract = new Contract(contractAddress, frogFunAbi, signer);

  const buyToken = async (tokenAddress: string, amount: bigint, totalCost: bigint) => {
    try {
      const tx = await contract.buyTokens(tokenAddress, amount, { value: totalCost });
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      toast.error("Buy token error");
    }
  }

  return buyToken;
}