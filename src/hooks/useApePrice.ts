import getApePrice from "@/lib/getApePrice";
import { useQuery } from "@tanstack/react-query";

export default function useApePrice() {
  const { data: apePrice } = useQuery({
    queryKey: ["ape-price"],
    queryFn: getApePrice,
  });

  return apePrice ?? 0;
}
