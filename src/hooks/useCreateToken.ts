import frogFunAbi from "@/abi/frogFun.json";
import { CreateTokenParams } from "@/lib/types";
import { useEthersSigner } from "@/lib/wagmi-ethers";
import { Contract } from "ethers";

export default function useCreateToken() {
  const signer = useEthersSigner();
  const address = process.env.CONTRACT_ADDRESS;
  const contract = new Contract(address!, frogFunAbi.abi, signer);

  const createToken = async ({ amount, name, symbol }: CreateTokenParams) => {
    try {
      const tx = await contract.createToken(amount, name, symbol);
      await tx.wait();
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  return {
    createToken,
  };
}
