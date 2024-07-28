import { checkUserExists, createUser, fetchUser } from "@/lib/actions";
import { User } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export default function useUser(address: `0x${string}`) {
  const [user, setUser] = useState<User>();

  const fetchCurrentUser = useCallback(async () => {
    const currentUser = await fetchUser(address as `0x${string}`);
    setUser(currentUser);
  }, [address]);

  const checkAndCreateUser = async () => {
    const userExists = await checkUserExists(address as `0x${string}`);

    if (userExists) {
      const user = await fetchUser(address as `0x${string}`);
      console.log('user', user)
      return user;
    } else if (!userExists) {
      await createUser({
        wallet: address as `0x${string}`,
      });

      const user = await fetchUser(address as `0x${string}`);
      return user;
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return { user, checkAndCreateUser };
}
