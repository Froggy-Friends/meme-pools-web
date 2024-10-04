import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract, formatUnits } from "ethers";

export default function useSellPrice() {
  const signer = useEthersSigner();
  const contract = new Contract(contractAddress, frogFunAbi, signer);

  const getSellPrice = async (tokenAddress: string, amount: string) => {
    let totalPrice: number = 0;

    try {
      // To DO Update to use calculateSellPrce when contract is fixed
      const price = await contract.getTokenPrice(tokenAddress);
      const formattedPrice = formatUnits(price);
      totalPrice = Number(formattedPrice) * Number(amount);
    } catch (error) {
      console.log(error);
    }

    return totalPrice;
  };

  return getSellPrice;
}
