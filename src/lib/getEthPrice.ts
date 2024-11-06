export default async function getEthPrice() {
  const res = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot");
  const data = await res.json();
  return Number(data?.data?.amount || 0);
}
