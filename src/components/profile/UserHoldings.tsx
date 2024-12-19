import { fetchUserHoldings } from "@/queries/profile/queries";
import { User } from "@prisma/client";
import Link from "next/link";
import PurchasedCoinCard from "./PurchasedCoinCard";
import { Chain } from "@/models/chain";

type UserHoldingsProps = {
  profileUser: User;
  cachedUser: User | null;
  chain: Chain;
};

export default async function UserHoldings({ profileUser, cachedUser, chain }: UserHoldingsProps) {
  const holdings = await fetchUserHoldings(profileUser.id, chain);
  let enabled = profileUser.id === cachedUser?.id;
  const sortedHoldings = holdings.sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));

  return (
    <section className="mt-10 mb-12 flex flex-col gap-y-2 bg-dark-gray rounded-xl p-6">
      <p className="text-2xl mb-4">Holdings</p>
      {!holdings.length && cachedUser && cachedUser.id === profileUser.id && (
        <p className="-mt-4">
          <Link href="/" className="text-primary hover:text-light-primary transition">
            Buy
          </Link>{" "}
          your first coin
        </p>
      )}
      {!holdings.length && cachedUser && cachedUser.id !== profileUser.id && (
        <p className="ml-1 -mt-8">No coins purchased</p>
      )}
      {sortedHoldings.map(token => {
        return <PurchasedCoinCard key={token.id} token={token} enabled={enabled} />;
      })}
    </section>
  );
}
