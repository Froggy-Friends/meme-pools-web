export default async function getApePrice() {
  const res = await fetch("https://api.coinbase.com/v2/prices/APE-USD/spot");
  const data = await res.json();
  return Number(data?.data?.amount || 0);
}
