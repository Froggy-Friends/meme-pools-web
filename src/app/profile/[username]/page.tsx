import ProfileInfo from "@/components/profile/ProfileInfo";
import { SearchParams } from "@/lib/types";
import ProfileMenuToggle from "../../../components/profile/ProfileMenuToggle";
import Followers from "../../../components/profile/Followers";
import Following from "../../../components/profile/Following";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchFollow, fetchFollowers, fetchFollowing, fetchUser, fetchUserByName } from "@/queries/profile/queries";
import { Chains } from "@/models/chains";
import { cookies } from "next/headers";

type ProfilePageProps = {
  params: {
    username: string;
  };
  searchParams: SearchParams;
};

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const view = (searchParams.view as string) || "followers";
  const cookieStore = cookies();
  const currentUserEvmAddress = cookieStore.get("user-evm-address");
  const currentUser = await fetchUser(currentUserEvmAddress?.value);
  const user = await fetchUserByName(params.username);
  if (!user) {
    throw new Error("User not found");
  }
  const isFollowing = await fetchFollow(user.id, currentUser?.id!);
  const followers = await fetchFollowers(user.id);
  const following = await fetchFollowing(user.id);

  return (
    <main className="flex flex-col px-12 mb-20">
      <Header chain={Chains.Base}/>

      <ProfileInfo profileUser={user} currentUser={currentUser!} isFollowing={isFollowing?.status!}/>

      <div className="flex flex-col mx-auto">
        <ProfileMenuToggle profileUser={user} />
        {view === "followers" && <Followers followers={followers} />}
        {view === "following" && <Following following={following} />}
      </div>

      <Footer />
    </main>
  );
}
