"use client";

import { User } from "@prisma/client";
import ProfileMenuButton from "./ProfileMenuButton";
import useFrogBalance from "@/hooks/useFrogBalance";
import { Address } from "viem";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type ProfileMenuToggleProps = {
  profileUser: User;
  cachedUser: User | null | undefined;
  currentView: string;
  delegatedWallets: Address[];
};

export default function ProfileMenuToggle({
  profileUser,
  cachedUser,
  currentView,
  delegatedWallets,
}: ProfileMenuToggleProps) {
  const walletAddresses = useMemo(() => {
    return delegatedWallets ? [...delegatedWallets, profileUser.ethAddress] : [profileUser.ethAddress];
  }, [delegatedWallets, profileUser.ethAddress]);
  const frogBalance = useFrogBalance(walletAddresses as Address[]);
  const router = useRouter();

  if (frogBalance === 0 && currentView === "Claim") {
    router.push(`/profile/${profileUser.name}`);
  }

  return (
    <div className="overflow-x-auto">
      <section className="flex gap-x-4 items-center my-6 min-w-max">
        {cachedUser?.id === profileUser.id && (
          <ProfileMenuButton view="Holdings" profileUser={profileUser} currentView={currentView} />
        )}
        {cachedUser?.id === profileUser.id && (
          <ProfileMenuButton view="Settings" profileUser={profileUser} currentView={currentView} />
        )}
        <ProfileMenuButton view="Created" profileUser={profileUser} currentView={currentView} />
        <ProfileMenuButton view="Followers" profileUser={profileUser} currentView={currentView} />
        <ProfileMenuButton view="Following" profileUser={profileUser} currentView={currentView} />
        {cachedUser?.id === profileUser.id && frogBalance > 0 && (
          <ProfileMenuButton view="Claim" profileUser={profileUser} currentView={currentView} />
        )}
      </section>
    </div>
  );
}
