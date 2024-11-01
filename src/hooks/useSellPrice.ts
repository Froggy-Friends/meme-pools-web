import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress, rpcUrl } from "@/config/env";
import { Contract, ethers } from "ethers";

export default function useSellPrice() {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new Contract(contractAddress, memepoolsAbi, provider);

  const getSellPrice = async (tokenAddress: string, amount: bigint) => {
    let totalPayout: bigint = BigInt(0);

    try {
      const [price, cost, fee, payout] = await contract.calculateSellPrice(
        tokenAddress,
        amount
      );

      totalPayout = payout;
    } catch (error) {
      console.log(error);
    }

    return totalPayout;
  };

  return getSellPrice;
}
