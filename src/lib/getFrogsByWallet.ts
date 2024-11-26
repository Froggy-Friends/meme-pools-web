import { Address } from "viem";

export const getFrogsByWallet = async (address: Address) => {
  if (!address) {
    return [];
  }

  const response = await fetch(`/api/frog-ids?address=${address}`);
  const data = await response.json();

  return data.result.map((frog: any) => Number(frog.token_id));
};