import {
  checkFollowStatus,
  checkIfFollowing,
} from "@/app/profile/[wallet]/queries";
import { useCallback, useEffect, useState } from "react";

export default function useIsFollowingUser(
  accountId: string,
  followerId: string
) {
  const [following, setFollowing] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  const checkFollowing = useCallback(async () => {
    setIsLoading(true);

    if (followerId === "") {
      setIsLoading(false);
      return;
    }

    const following = await checkIfFollowing(accountId, followerId);
    if (following) {
      const followStatus = await checkFollowStatus(accountId, followerId);
      followStatus === "Follow" && setFollowing(true);
      followStatus === "Unfollow" && setFollowing(false);
    } else {
      setFollowing(false);
    }

    setIsLoading(false)
  }, [accountId, followerId]);

  useEffect(() => {
    checkFollowing();
  }, [checkFollowing, accountId, followerId]);

  return { following, checkFollowing, isLoading };
}
