"use client";

import ProfileAvatar from "./ProfileAvatar";
import useUser from "@/hooks/useUser";
import { User } from "@prisma/client";
import MobileMenu from "./MobileMenu";
import { useChain } from "@/context/chain";
import { useAccount } from "wagmi";
import { useDisconnect } from "@reown/appkit/react";
import { useWallet } from "@solana/wallet-adapter-react";

type NavbarProps = {
  cachedUser: User | null;
};

export default function ProfileAndMenuContainer({ cachedUser }: NavbarProps) {
  const { currentUser } = useUser();
  const { chain } = useChain();

  //evm hooks
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // sol hooks
  const { connected } = useWallet();
  const solDisconnect = useWallet().disconnect;

  return (
    <>
      <ProfileAvatar
        cachedUser={cachedUser || null}
        currentUser={currentUser || null}
        isConnected={isConnected}
        connected={connected}
        chain={chain.name}
        disconnect={disconnect}
        solDisconnect={solDisconnect}
      />

      <MobileMenu
        cachedUser={cachedUser || null}
        currentUser={currentUser || null}
        isConnected={isConnected}
        connected={connected}
        chain={chain.name}
        disconnect={disconnect}
        solDisconnect={solDisconnect}
      />
    </>
  );
}
