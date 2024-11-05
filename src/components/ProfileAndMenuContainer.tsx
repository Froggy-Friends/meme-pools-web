"use client";

import ProfileAvatar from "./ProfileAvatar";
import useUser from "@/hooks/useUser";
import { User } from "@prisma/client";
import MobileMenu from "./MobileMenu";
import { useChain } from "@/context/chain";
import { useDisconnect } from "@reown/appkit/react";
import { useAppKitAccount } from "@reown/appkit/react";

type NavbarProps = {
  cachedUser: User | null;
};

export default function ProfileAndMenuContainer({ cachedUser }: NavbarProps) {
  const { currentUser } = useUser();
  const { chain } = useChain();

  const { isConnected, address } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <ProfileAvatar
        cachedUser={cachedUser || null}
        currentUser={currentUser || null}
        isConnected={isConnected}
        chain={chain.name}
        disconnect={disconnect}
        address={address}
      />

      <MobileMenu
        cachedUser={cachedUser || null}
        currentUser={currentUser || null}
        isConnected={isConnected}
        chain={chain.name}
        disconnect={disconnect}
        address={address}
      />
    </>
  );
}
