import { updateVote } from "@/app/token/[tokenAddress]/actions";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import useUser from "./useUser";

export default function useCastVote(tokenId: string) {
  const { address } = useAccount();
  const { currentUser } = useUser(address!);

  const {
    data,
    isPending: isCastingVote,
    mutate: castVote,
  } = useMutation<void, Error, string | null>({
    mutationKey: ["castVote"],
    mutationFn: async (status) => {
      updateVote(tokenId, currentUser?.id!, status);
    },
  });

  return {
    data,
    isCastingVote,
    castVote,
  };
}
