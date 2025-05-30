import ProfileInfo from "@/components/profile/ProfileInfo";
import { SearchParams } from "@/lib/types";
import ProfileMenuToggle from "../../../components/profile/ProfileMenuToggle";
import Followers from "../../../components/profile/Followers";
import Following from "../../../components/profile/Following";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchFollow, fetchFollowers, fetchFollowing, fetchUser, fetchUserByName } from "@/queries/profile/queries";
import { Chain } from "@/models/chain";
import { cookies } from "next/headers";
import { Cookie } from "@/models/cookie";
import CreatedTokens from "@/components/profile/CreatedTokens";
import EditProfileForm from "@/components/profile/EditProfileForm";
import Claim from "@/components/profile/Claim";
import UserHoldings from "@/components/profile/UserHoldings";
import { getDelegations } from "@/lib/getDelegations";
import { Address } from "viem";

type ProfilePageProps = {
  params: {
    username: string;
  };
  searchParams: SearchParams;
};

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const cookieStore = cookies();
  const cachedUserEvmAddress = cookieStore.get(Cookie.EvmAddress);
  const cachedUserSolanaAddress = cookieStore.get(Cookie.SolanaAddress);
  const chain = cookieStore.get(Cookie.Chain)?.value as Chain || Chain.Base;
  const cachedUser = await fetchUser(
    chain === Chain.Solana ? cachedUserSolanaAddress?.value : cachedUserEvmAddress?.value
  );
  const profileUser = await fetchUserByName(decodeURIComponent(params.username));
  if (!profileUser) {
    throw new Error("User not found");
  }
  const isFollowing = await fetchFollow(profileUser.id, cachedUser?.id!);
  const followers = await fetchFollowers(profileUser.id);
  const following = await fetchFollowing(profileUser.id);
  const view = (searchParams.view as string) || (profileUser.id === cachedUser?.id ? "holdings" : "created");
  const delegatedWallets = await getDelegations(profileUser.ethAddress as Address);

  return (
    <main className="flex flex-col min-h-[100vh] max-w-[410px] tablet:max-w-[750px] laptop:max-w-[924px] desktop:max-w-[1200px] mx-auto px-2 laptop:px-4">
      <Header chain={chain} />

      <ProfileInfo
        profileUser={profileUser}
        cachedUser={cachedUser}
        isFollowing={isFollowing?.status || "false"}
        delegatedWallets={delegatedWallets}
      />

      <ProfileMenuToggle
        profileUser={profileUser}
        cachedUser={cachedUser}
        currentView={view}
        delegatedWallets={delegatedWallets}
        chain={chain}
      />

      {view === "holdings" && profileUser.id === cachedUser?.id && (
        <UserHoldings profileUser={profileUser} cachedUser={cachedUser || null} chain={chain} />
      )}
      {view === "settings" && profileUser.id === cachedUser?.id && <EditProfileForm profileUser={profileUser} />}
      {view === "created" && (
        <CreatedTokens
          profileUser={profileUser}
          cachedUser={cachedUser || null}
          delegatedWallets={delegatedWallets}
          chain={chain}
        />
      )}
      {view === "followers" && (
        <Followers followers={followers} profileUser={profileUser} cachedUser={cachedUser || null} />
      )}
      {view === "following" && (
        <Following following={following} profileUser={profileUser} cachedUser={cachedUser || null} />
      )}
      {view === "claim" && profileUser.id === cachedUser?.id && (
        <Claim
          profileUser={profileUser}
          cachedUser={cachedUser || null}
          delegatedWallets={delegatedWallets}
          chain={chain}
        />
      )}

      <Footer />
    </main>
  );
}
