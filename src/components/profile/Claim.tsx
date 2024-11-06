import ClaimRewardsText from "./ClaimRewardsText";
import { Address } from "viem";
import Link from "next/link";
import { User } from "@prisma/client";
import { fetchClaimableTokens } from "@/queries/profile/queries";
import ClaimableTokenCard from "./ClaimableTokenCard";

type ClaimTokensProps = {
  profileUser: User;
  cachedUser: User | null;
};

export default async function ClaimTokens({ profileUser, cachedUser }: ClaimTokensProps) {
  let enabled = profileUser.id === cachedUser?.id;
  const claimableTokens = await fetchClaimableTokens();

  return (
    <section className="mt-10 mb-12 flex flex-col gap-y-2 bg-dark-gray rounded-xl p-4 tablet:p-6 w-full tablet:w-[75%] laptop:w-[66%]">
      <ClaimRewardsText address={profileUser.ethAddress as Address} />
      {claimableTokens &&
        claimableTokens.map(token => {
          return <ClaimableTokenCard key={token.id} token={token} enabled={enabled} />;
        })}
    </section>
  );
}
