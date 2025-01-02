import { apePriceUrl } from "@/config/chains";

export default async function getApePrice() {
  const res = await fetch(apePriceUrl);
  const data = await res.json();
  return Number(data?.data?.amount || 0);
}
