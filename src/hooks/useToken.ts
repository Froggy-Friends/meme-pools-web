import { fetchTokenById } from "@/queries/token/queries";
import { useQuery } from "@tanstack/react-query";

export default function useToken(tokenId: string) {
  const {
    data: token,
    isPending: isLoadingToken,
    refetch,
  } = useQuery({
    queryKey: ["token", tokenId],
    queryFn: async () => {
      if (!tokenId) return null;
      const token = await fetchTokenById(tokenId);
      return token;
    },
  });

  return {
    token,
    isLoadingToken,
    refetch,
  };
}
