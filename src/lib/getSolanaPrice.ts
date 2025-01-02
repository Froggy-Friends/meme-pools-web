import { solanaPriceUrl } from "@/config/chains";

export default async function getSolanaPrice() {
  const res = await fetch(solanaPriceUrl);
  const data = await res.json();
  return Number(data?.data?.amount || 0);
}
