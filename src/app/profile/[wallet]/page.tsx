import UserInfo from "@/app/profile/[wallet]/components/UserInfo";

import { Address } from "@/lib/types";
import { fetchUser } from "./queries";

type ProfilePageProps = {
  params: {
    wallet: Address;
  };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await fetchUser(params.wallet);
  if (!user) {
    throw new Error("User not found");
  }

  return (
    <main className="flex flex-col items-center px-12 mb-20">
      <UserInfo profileUser={user} profileWalletAddress={params.wallet} />
    </main>
  );
}
