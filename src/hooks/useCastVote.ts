import { updateVote } from "@/app/token/[tokenAddress]/actions";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import useUser from "./useUser";

export default function useCastVote(tokenId: string) {
  const { address } = useAccount();
  const { currentUser } = useUser(address!);
  const queryClient = new QueryClient();

  const {
    data,
    isPending: isCastingVote,
    mutate: castVote,
  } = useMutation<void, Error, string | null>({
    mutationKey: ["castVote", tokenId],
    mutationFn: async (status) => {
      console.log("casting vote");
      updateVote(tokenId, currentUser?.id!, status);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["votes", tokenId],
      });
    },
  });

  return {
    data,
    isCastingVote,
    castVote,
  };
}
