import { fetchCreatedTokens } from "@/queries/profile/queries";
import { User } from "@prisma/client";
import Link from "next/link";
import CreatedCoinCard from "./CreatedCoinCard";
import { Address } from "viem";
import LaunchRewardsText from "./LaunchRewardsText";

type CreatedTokensProps = {
  profileUser: User;
  cachedUser: User | null;
};

export default async function CreatedTokens({ profileUser, cachedUser }: CreatedTokensProps) {
  const createdTokens = await fetchCreatedTokens(profileUser.id);
  let enabled = profileUser.id === cachedUser?.id;

  return (
    <section className="mt-10 mb-12 flex flex-col gap-y-2 bg-dark-gray rounded-xl p-6">
      {enabled && <LaunchRewardsText address={profileUser.ethAddress as Address} />}
      {!createdTokens.length && cachedUser && cachedUser.id === profileUser.id && (
        <p className="ml-1 -mt-8">
          <Link href="/create" className="text-primary hover:text-light-primary transition">
            Create
          </Link>{" "}
          your first coin
        </p>
      )}
      {!createdTokens.length && cachedUser && cachedUser.id !== profileUser.id && (
        <p className="ml-1 -mt-8">No coins created</p>
      )}
      {createdTokens.map(token => {
        return <CreatedCoinCard key={token.id} token={token} enabled={enabled} />;
      })}
    </section>
  );
}
