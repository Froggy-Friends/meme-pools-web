import getTokenPrice, { EvmChain } from "./getTokenPrice";

export default async function getEthPrice(address: string, chain: EvmChain) {
  const { usdPriceFormatted } = await getTokenPrice(address, chain);

  if (!usdPriceFormatted) {
    throw new Error("Error fetching ETH price");
  }

  return Number(usdPriceFormatted);
}
