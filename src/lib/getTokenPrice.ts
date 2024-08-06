import Moralis from "moralis";

export enum EvmChain {
  "mainnet" = "0x2105",
  "sepolia" = "0x14A34",
}

export default async function getTokenPrice(address: string, chain: EvmChain) {
  const res = await Moralis.EvmApi.token.getTokenPrice({
    chain,
    address,
  });
  return res.toJSON();
}
