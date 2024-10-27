import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract, formatUnits } from "ethers";

export default function useSellPrice() {
  const signer = useEthersSigner();
  const contract = new Contract(contractAddress, memepoolsAbi, signer);

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
