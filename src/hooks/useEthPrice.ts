import { useQuery } from "@tanstack/react-query";
import getEthPrice from "@/lib/getEthPrice";

export default function useEthPrice() {
  const { data: ethPrice } = useQuery({
    queryKey: ["eth-price"],
    queryFn: getEthPrice,
  });

  return ethPrice ?? 0;
}
