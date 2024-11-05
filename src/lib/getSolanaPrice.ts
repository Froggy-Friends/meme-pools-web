export default async function getSolanaPrice() {
  const res = await fetch("https://api.coinbase.com/v2/prices/SOL-USD/spot");
  const data = await res.json();
  return Number(data.data.amount || 0);
}
