import { frogFunAbi } from "@/abi/frogFun";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Address } from "@/lib/types";
import { Contract } from "ethers";
import toast from "react-hot-toast";


export default function useBuyToken() {
  const signer = useEthersSigner();
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contract = new Contract(address!, frogFunAbi, signer);

  const buyToken = async (address: string, amount: bigint) => {
    try {
      const [price, cost, fee, total] = await contract.calculateBuyPrice(
        address,
        amount
      );
      console.log("buy price: ", price);
      console.log("buy cost: ", cost);
      console.log("buy fee: ", fee);
      console.log("buy total: ", total);

      return {
        price,
        cost,
        fee,
        total
      };
    } catch (error) {
      console.log(error);
      toast.error("Buy token error");
    }
  }

  return buyToken;
}