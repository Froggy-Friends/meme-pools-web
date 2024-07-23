import frogFunAbi from "@/abi/frogFun.json";
import { CreateTokenParams } from "@/lib/types";
import { useEthersSigner } from "@/lib/wagmi-ethers";
import { Contract } from "ethers";

export default function useCreateToken() {
  const signer = useEthersSigner();
  const address = "0xe4c55bdA36E54c8f5d3378E141f6197366a2B678";
  const contract = new Contract(address, frogFunAbi.abi, signer);

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
