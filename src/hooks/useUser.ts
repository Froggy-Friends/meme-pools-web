import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccount } from "wagmi";
import { fetchUser } from "@/queries/profile/queries";
import { createUser, setUserCookies } from "@/actions/profile/actions";
import { User } from "@prisma/client";

export default function useUser() {
  const [currentUser, setCurrentUser] = useState<User | null>();
  const { publicKey } = useWallet();
  const { address, isDisconnected } = useAccount();

  const checkAndCreateUser = useCallback(async () => {
    if (!address && !publicKey?.toString()) {
      return;
    }

    const user = await fetchUser(address || publicKey?.toString());

    if (user) {
      setCurrentUser(user);
      await setUserCookies(user);
    } else if ((!user && address) || publicKey?.toString()) {
      const wallet = address || publicKey?.toString();
      await createUser({
        wallet: wallet,
        name: wallet
      });
      const user = await fetchUser(address || publicKey?.toString());
      setCurrentUser(user);
      user && (await setUserCookies(user));
    }
  }, [address, publicKey]);

  useEffect(() => {
    checkAndCreateUser();
  }, [checkAndCreateUser, address, publicKey]);

  useEffect(() => {
    setCurrentUser(null);
  }, [isDisconnected]);

  return { currentUser };
}
