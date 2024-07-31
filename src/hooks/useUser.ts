import { createUser, fetchUser } from "@/lib/actions";
import { User, WalletAddress } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export default function useUser(address: WalletAddress) {
  const [currentUser, setCurrentUser] = useState<User | null>();

  const checkAndCreateUser = useCallback(async (address: WalletAddress) => {
    if (!address) {
      return 
    }

    const user = await fetchUser(address as WalletAddress);
   
    if (user) {
      setCurrentUser(user)
    } else if (!user) {
      await createUser({
        wallet: address as WalletAddress,
      });
      const user = await fetchUser(address as WalletAddress);
      setCurrentUser(user)
    }
  }, []);

  useEffect(() => {
    checkAndCreateUser(address);
  }, [checkAndCreateUser, address]);

  return { currentUser };
}
