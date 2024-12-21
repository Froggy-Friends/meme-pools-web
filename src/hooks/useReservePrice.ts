import { memepoolsAbi } from "@/abi/memepools";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { formatEther, parseUnits } from "viem";
import { Contract } from "ethers";
import { useChain } from "@/context/chain";
import { getContractAddress } from "@/lib/chains";

export default function useReservePrice() {
  const { chain } = useChain();
  const signer = useEthersSigner();
  const contractAddress = getContractAddress(chain.name);

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
