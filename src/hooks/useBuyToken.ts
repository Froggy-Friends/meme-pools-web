import { frogFunAbi } from "@/abi/frogFun";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import toast from "react-hot-toast";


export default function useBuyToken() {
  const signer = useEthersSigner();
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contract = new Contract(address!, frogFunAbi, signer);

  const buyToken = async (address: string, amount: bigint) => {

  }

  return buyToken;
}