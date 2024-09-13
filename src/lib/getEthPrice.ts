
export default async function getEthPrice(address: string) {
  const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
  const data = await res.json();
  const ethPrice = data.ethereum.usd;

  if (!ethPrice) {
    throw new Error("Error fetching ETH price");
  }

  return Number(ethPrice);
}
