import ProfileInfo from "@/components/profile/ProfileInfo";
import { SearchParams } from "@/lib/types";
import ProfileMenuToggle from "../../../components/profile/ProfileMenuToggle";
import Followers from "../../../components/profile/Followers";
import Following from "../../../components/profile/Following";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchFollowers, fetchFollowing, fetchUserByName } from "@/queries/profile/queries";

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
  const user = await fetchUserByName(params.username);
  if (!user) {
    throw new Error("User not found");
  }
  const followers = await fetchFollowers(user.id);
  const following = await fetchFollowing(user.id);

  return (
    <main className="flex flex-col px-12 mb-20">
      <Header />

      <ProfileInfo profileUser={user}  />

      <div className="flex flex-col mx-auto">
        <ProfileMenuToggle profileUser={user} />
        {view === "followers" && <Followers followers={followers} />}
        {view === "following" && <Following following={following} />}
      </div>

      <Footer />
    </main>
  );
}
