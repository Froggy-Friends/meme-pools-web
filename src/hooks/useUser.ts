import { useCallback, useEffect, useState } from "react";
import { fetchUser } from "@/queries/profile/queries";
import { createUser, setUserCookies } from "@/actions/profile/actions";
import { User } from "@prisma/client";
import { useAppKitAccount } from "@reown/appkit/react";

export default function useUser() {
  const [currentUser, setCurrentUser] = useState<User | null>();
  const { address, isConnected } = useAppKitAccount();

  const checkAndCreateUser = useCallback(async () => {
    if (!address) {
      return;
    }
    const user = await fetchUser(address);

    if (user) {
      setCurrentUser(user);
      await setUserCookies(user);
    } else if (!user && address) {
      const user = await createUser({
        wallet: address,
        name: address,
      });

      setCurrentUser(user);
      user && (await setUserCookies(user));
    }
  }, [address]);

  useEffect(() => {
    checkAndCreateUser();
  }, [checkAndCreateUser, address]);

  useEffect(() => {
    if (!isConnected) {
      setCurrentUser(null);
    }
  }, [isConnected]);

  return { currentUser };
}
