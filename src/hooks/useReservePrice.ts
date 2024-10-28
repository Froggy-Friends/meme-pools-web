import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { formatEther, formatGwei, parseUnits } from "viem";
import { Contract } from "ethers";
export default function useReservePrice() {
  const signer = useEthersSigner();
  const contract = new Contract(contractAddress, memepoolsAbi, signer);

  const getReservePrice = async (amount: number) => {
    let totalCost: bigint = BigInt(0);
    let reservePrice: bigint = BigInt(0);
    const amountWei = parseUnits(amount.toString(), 18);
    try {
      const [price, cost, fee, total] = await contract.calculateReservePrice(
        amountWei
      );
      totalCost = total;
      reservePrice = price;
    } catch (error) {
      console.error(error);
    }

    return {
      totalCost: formatEther(totalCost),
      reservePrice: reservePrice,
    };
  };

  return {
    getReservePrice,
  };
}
