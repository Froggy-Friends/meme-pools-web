import UserInfo from "@/app/profile/[wallet]/components/UserInfo";

import { WalletAddress } from "@/lib/types";
import { fetchUser } from "./queries";

type ProfilePageProps = {
  params: {
    wallet: WalletAddress;
  };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await fetchUser(params.wallet);

  return (
    <main className="flex flex-col items-center px-12 mb-20">
      <UserInfo user={user!} />
    </main>
  );
}
