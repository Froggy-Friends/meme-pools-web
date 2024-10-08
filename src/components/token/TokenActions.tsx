import CopyButton from "../CopyButton";
import TokenVote from "./TokenVote";
import TokenSocials from "./TokenSocials";
import { formatAddress } from "@/lib/formatAddress";
import { TokenWithVoteCount } from "@/types/token/types";
import { User } from "@prisma/client";
import { Address } from "viem";

type TokenActionsProps = {
  token: TokenWithVoteCount;
  cachedUser: User | null;
};

function TokenActions({ token, cachedUser }: TokenActionsProps) {
  return (
    <div className="flex justify-between gap-x-4 laptop:gap-x-10 mb-3 bg-dark-gray rounded-2xl px-4 py-2">
      <div className="flex gap-6">
        <div className="flex flex-col pl-1">
          <p className="text-gray text-sm tablet:text-lg laptop:text-xl">Votes</p>
          <TokenVote tokenId={token.id} cachedUser={cachedUser} />
        </div>

        <div className="flex flex-col">
          <p className="text-gray text-sm tablet:text-lg laptop:text-xl">CA</p>
          <div className="flex gap-x-2">
            <p className="text-sm tablet:text-lg laptop:text-xl">{formatAddress(token.tokenAddress)}</p>
            <CopyButton text={token.tokenAddress as Address} />
          </div>
        </div>
      </div>

      <TokenSocials token={token} />
    </div>
  );
}

export default TokenActions;
