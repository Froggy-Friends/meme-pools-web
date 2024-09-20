import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import toast from "react-hot-toast";

export default function useBuyPrice() {
  const signer = useEthersSigner();
  const contract = new Contract(contractAddress, frogFunAbi, signer);

  const buyPrice = async (address: string, amount: bigint) => {
    const buyPrice = {
      price: 0,
      cost: 0,
      fee: 0,
      total: 0
    };

    try {
      const [price, cost, fee, total] = await contract.calculateBuyPrice(
        address,
        amount
      );

      buyPrice.price = price;
      buyPrice.cost = cost;
      buyPrice.fee = fee;
      buyPrice.total = total;
    } catch (error) {
      console.log(error);
      toast.error("Buy token error");
    }

    return buyPrice;
  }

  return buyPrice;
}