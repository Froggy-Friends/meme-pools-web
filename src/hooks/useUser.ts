import { createUser } from "@/app/profile/[wallet]/actions";
import { fetchUser } from "@/app/profile/[wallet]/queries";
import { User } from "@/app/profile/[wallet]/types";
import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccount } from "wagmi";

export default function useUser() {
  const [currentUser, setCurrentUser] = useState<User | null>();
  const { publicKey } = useWallet();
  const { address } = useAccount();

  const checkAndCreateUser = useCallback(async () => {
    if (!address && !publicKey?.toString()) {
      return;
    }
    
    const user = await fetchUser(address || publicKey?.toString());
    
    if (user) {
      setCurrentUser(user);
    } else if (!user && address || publicKey?.toString()) {
      await createUser({
        wallet: address || publicKey?.toString(),
      });
      const user = await fetchUser(address || publicKey?.toString());
      setCurrentUser(user);
    }
  }, [address, publicKey]);

  useEffect(() => {
    checkAndCreateUser();
  }, [checkAndCreateUser, address, publicKey]);

  return { currentUser };
}
