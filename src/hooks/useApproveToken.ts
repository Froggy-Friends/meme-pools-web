import { frogFunTokenAbi } from "@/abi/frogFunToken";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { maxTotalSupply } from "@/lib/constants";
import { Contract } from "ethers";
import { parseUnits } from "viem";

export default function useApproveToken(tokenAddress: string) {
  const signer = useEthersSigner();
  const contract = new Contract(tokenAddress, frogFunTokenAbi, signer);

  const approveToken = async () => {
    const tx = await contract.approve(
      contractAddress,
      parseUnits(maxTotalSupply.toString(), 18)
    );
    await tx.wait();
  };

  return { approveToken };
}
