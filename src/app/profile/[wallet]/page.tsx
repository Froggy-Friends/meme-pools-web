import ProfileInfo from "@/app/profile/[wallet]/components/ProfileInfo";
import { Address, SearchParams } from "@/lib/types";
import { fetchFollowers, fetchFollowing, fetchUser } from "./queries";
import ProfileMenuToggle from "./components/ProfileMenuToggle";
import Followers from "./components/Followers";
import Following from "./components/Following";

type ProfilePageProps = {
  params: {
    wallet: Address;
  };
  searchParams: SearchParams;
};

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const view = (searchParams.view as string) || "followers";
  const user = await fetchUser(params.wallet);
  if (!user) {
    throw new Error("User not found");
  }
  const followers = await fetchFollowers(user.id);
  const following = await fetchFollowing(user.id);

  return (
    <main className="flex flex-col px-12 mb-20">
      <ProfileInfo profileUser={user} profileWalletAddress={params.wallet} />

      <div className="flex flex-col mx-auto">
        <ProfileMenuToggle profileAddress={user.ethAddress!} />
        {view === "followers" && <Followers followers={followers} />}
        {view === "following" && <Following following={following} />}
      </div>
    </main>
  );
}
