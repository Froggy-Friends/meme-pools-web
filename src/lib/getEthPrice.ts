import { ethPriceUrl } from "@/config/chains";

export default async function getEthPrice() {
  const res = await fetch(ethPriceUrl);
  const data = await res.json();
  return Number(data?.data?.amount || 0);
}
