import ProfileInfo from "@/components/profile/ProfileInfo";
import { SearchParams } from "@/lib/types";
import ProfileMenuToggle from "../../../components/profile/ProfileMenuToggle";
import Followers from "../../../components/profile/Followers";
import Following from "../../../components/profile/Following";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  fetchFollow,
  fetchFollowers,
  fetchFollowing,
  fetchUser,
  fetchUserByName,
} from "@/queries/profile/queries";
import { Chain } from "@/models/chain";
import { cookies } from "next/headers";
import { Cookie } from "@/models/cookie";
import { toTitleCase } from "@/lib/toTitleCase";
import BackButton from "@/components/BackButton";

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
  const view = (searchParams.view as string) || "profile";
  const cookieStore = cookies();
  const cachedUserEvmAddress = cookieStore.get(Cookie.EvmAddress);
  const cachedUser = await fetchUser(cachedUserEvmAddress?.value);
  const profileUser = await fetchUserByName(params.username);
  if (!profileUser) {
    throw new Error("User not found");
  }
  const isFollowing = await fetchFollow(profileUser.id, cachedUser?.id!);
  const followers = await fetchFollowers(profileUser.id);
  const following = await fetchFollowing(profileUser.id);

  return (
    <main className="flex flex-col max-w-[1200px] min-h-[100vh] mx-auto">
      <Header chain={Chain.Base} />

      <BackButton />

      <h2 className="text-[56px] font-semibold">{toTitleCase(view)}</h2>

      <ProfileMenuToggle profileUser={profileUser} currentView={view} />

      {view === "profile" && (
        <ProfileInfo
          profileUser={profileUser}
          cachedUser={cachedUser || null}
          isFollowing={isFollowing?.status || "false"}
        />
      )}

      {view === "followers" && (
        <Followers followers={followers} profileUser={profileUser} />
      )}
      {view === "following" && (
        <Following following={following} profileUser={profileUser} />
      )}

      <Footer />
    </main>
  );
}
