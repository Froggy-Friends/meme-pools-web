import { fetchCreatedTokens } from "@/queries/profile/queries";
import { User } from "@prisma/client";
import TokenDisplayCard from "../TokenDisplayCard";
import Link from "next/link";

type CreatedTokensProps = {
  profileUser: User;
  cachedUser: User | null;
};

export default async function CreatedTokens({ profileUser, cachedUser }: CreatedTokensProps) {
  const createdTokens = await fetchCreatedTokens(profileUser.id);

  return (
    <section className="mt-10 mb-12 laptop:mb-24 grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5 gap-3 tablet:gap-4 laptop:gap-3">
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
        return <TokenDisplayCard key={token.id} token={token} />;
      })}
    </section>
  );
}
