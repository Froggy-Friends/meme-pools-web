import { createUser, fetchUser } from "@/lib/actions";
import { User } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export default function useUser(address: `0x${string}`) {
  const [currentUser, setCurrentUser] = useState<User | null>();

  const checkAndCreateUser = useCallback(async (address: `0x${string}`) => {
    if (!address) {
      return 
    }

    const user = await fetchUser(address as `0x${string}`);
   
    if (user) {
      setCurrentUser(user)
    } else if (!user) {
      await createUser({
        wallet: address as `0x${string}`,
      });
      const user = await fetchUser(address as `0x${string}`);
      setCurrentUser(user)
    }
  }, []);

  useEffect(() => {
    checkAndCreateUser(address);
  }, [checkAndCreateUser, address]);

  return { currentUser };
}
