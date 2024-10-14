import { fetchCreatedTokens } from "@/queries/profile/queries";
import { User } from "@prisma/client";
import TokenDisplayCard from "../TokenDisplayCard";

type CreatedTokensProps = {
  profileUser: User;
};

export default async function CreatedTokens({ profileUser }: CreatedTokensProps) {
  const createdTokens = await fetchCreatedTokens(profileUser.id);

  return (
    <section className="mt-10 mb-12 laptop:mb-24 grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5 gap-3 tablet:gap-4 laptop:gap-3">
      {createdTokens.map(token => {
        return <TokenDisplayCard key={token.id} token={token} />;
      })}
    </section>
  );
}
