
import { createUser } from "@/app/profile/[wallet]/actions";
import { fetchUser } from "@/app/profile/[wallet]/queries";
import { User } from "@/app/profile/[wallet]/types";
import { Address } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export default function useUser(address: Address) {
  const [currentUser, setCurrentUser] = useState<User | null>();

  const checkAndCreateUser = useCallback(async (address: Address) => {
    if (!address) {
      return 
    }

    const user = await fetchUser(address);
   
    if (user) {
      setCurrentUser(user)
    } else if (!user) {
      await createUser({
        wallet: address,
      });
      const user = await fetchUser(address);
      setCurrentUser(user)
    }
  }, []);

  useEffect(() => {
    checkAndCreateUser(address);
  }, [checkAndCreateUser, address]);

  return { currentUser };
}
