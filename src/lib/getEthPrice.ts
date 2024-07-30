import getTokenPrice from "./getTokenPrice";

const BASE_ETH_ADDR = "0x4200000000000000000000000000000000000006";

export default async function getEthPrice() {
  const { usdPriceFormatted } = await getTokenPrice(BASE_ETH_ADDR);

  if (!usdPriceFormatted) {
    throw new Error("Error fetching ETH price");
  }

  return Number(usdPriceFormatted);
}
