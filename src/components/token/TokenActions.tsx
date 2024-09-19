import CopyButton from "../CopyButton";
import { Address } from "@/lib/types";
import TokenVote from "./TokenVote";
import TokenSocials from "./TokenSocials";
import { formatAddress } from "@/lib/formatAddress";
import { TokenWithVoteCount } from "@/types/token/types";
import { User } from "@prisma/client";

type TokenActionsProps = {
  token: TokenWithVoteCount;
  cachedUser: User | null;
};

function TokenActions({ token, cachedUser }: TokenActionsProps) {
  return (
    <div className="flex justify-between gap-x-10 pb-4">
      <div className="flex gap-6">
        <div className="flex flex-col">
          <p className="text-gray text-lg mb-2">Votes</p>
          <TokenVote tokenId={token.id} cachedUser={cachedUser} />
        </div>

        <div className="flex flex-col">
          <p className="text-gray text-lg mb-2">CA</p>
          <div className="flex gap-x-2">
            <p className="text-xl">{formatAddress(token.tokenAddress, 5)}</p>
            <CopyButton text={token.tokenAddress as Address} />
          </div>
        </div>
      </div>

      <TokenSocials token={token} />
    </div>
  );
}

export default TokenActions;
