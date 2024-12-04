import ClaimRewardsText from "./ClaimRewardsText";
import { Address } from "viem";
import { User } from "@prisma/client";
import { fetchClaimableTokens } from "@/queries/profile/queries";
import ClaimableTokenCard from "./ClaimableTokenCard";
import { getFrogsByWallet } from "@/lib/getFrogsByWallet";

type ClaimTokensProps = {
  profileUser: User;
  cachedUser: User | null;
  delegatedWallets: Address[];
};

export default async function ClaimTokens({ profileUser, cachedUser, delegatedWallets }: ClaimTokensProps) {
  const walletAddresses = delegatedWallets ? [...delegatedWallets, profileUser.ethAddress] : [profileUser.ethAddress];
  let enabled = profileUser.id === cachedUser?.id;
  const frogIds = await getFrogsByWallet(profileUser.ethAddress as Address);
  const claimableTokens = await fetchClaimableTokens(frogIds);

  return (
    <section className="mt-10 mb-12 flex flex-col gap-y-2 bg-dark-gray rounded-xl p-4 tablet:p-6 w-full tablet:w-[75%] laptop:w-[66%]">
      <ClaimRewardsText addresses={walletAddresses as Address[]} />
      {claimableTokens &&
        claimableTokens.map(claim => {
          return (
            <ClaimableTokenCard key={claim.id} token={claim.token} enabled={enabled} isClaimed={claim.isClaimed} />
          );
        })}
    </section>
  );
}
