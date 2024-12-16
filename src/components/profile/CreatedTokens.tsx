import { fetchCreatedTokens } from "@/queries/profile/queries";
import { User } from "@prisma/client";
import Link from "next/link";
import CreatedCoinCard from "./CreatedCoinCard";
import { Address } from "viem";
import LaunchRewardsText from "./LaunchRewardsText";
import { cn } from "@nextui-org/react";

type CreatedTokensProps = {
  profileUser: User;
  cachedUser: User | null;
  delegatedWallets: Address[];
};

export default async function CreatedTokens({ profileUser, cachedUser, delegatedWallets }: CreatedTokensProps) {
  const walletAddresses = delegatedWallets ? [...delegatedWallets, profileUser.ethAddress] : [profileUser.ethAddress];
  const createdTokens = await fetchCreatedTokens(profileUser.id);
  let enabled = profileUser.id === cachedUser?.id;
  const sortedCreatedTokens = createdTokens.sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));

  return (
    <>
      {!createdTokens.length && !cachedUser && <p className="ml-1">No coins created</p>}
      {!createdTokens.length && cachedUser && cachedUser.id !== profileUser.id && (
        <p className="ml-1">No coins created</p>
      )}
      <section
        className={cn(
          "mt-10 mb-12 flex flex-col gap-y-2 bg-dark-gray rounded-xl p-6",
          !createdTokens.length && cachedUser && cachedUser.id !== profileUser.id && "bg-dark",
          !createdTokens.length && !cachedUser && "bg-dark"
        )}
      >
        {enabled && <LaunchRewardsText addresses={walletAddresses as Address[]} />}
        {!createdTokens.length && cachedUser && cachedUser.id === profileUser.id && (
          <p className="-mt-8">
            <Link href="/create" className="text-primary hover:text-light-primary transition">
              Create
            </Link>{" "}
            your first coin
          </p>
        )}
        {sortedCreatedTokens.map(token => {
          return <CreatedCoinCard key={token.id} token={token} enabled={enabled} />;
        })}
      </section>
    </>
  );
}
