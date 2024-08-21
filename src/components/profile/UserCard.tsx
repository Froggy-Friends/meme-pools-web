import { followUser, unfollowUser } from "@/actions/profile/actions";
import { FollowStatus } from "@/models/follow";
import { fetchFollow, fetchUser } from "@/queries/profile/queries";
import { User } from "@prisma/client";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import FollowButton from "./FollowButton";

type UserCardProps = {
  user: User;
};

export default async function UserCard({ user }: UserCardProps) {
  const cookieStore = cookies();
  const userEvmAddress = cookieStore.get("user-evm-address");
  const currentUser = await fetchUser(userEvmAddress?.value);
  const isFollowing = await fetchFollow(user.id, currentUser?.id!);

  return (
    <div className="flex items-center gap-x-2 border border-black rounded-lg p-3">
      <Image
        src={user.imageUrl!}
        alt="User profile image"
        height={30}
        width={30}
        className="rounded-full"
      />
      <Link href={`/profile/${user.name}`} className="hover:underline">
        {user.name}
      </Link>

      {currentUser && currentUser.id !== user.id && (
        <FollowButton
          isFollowing={isFollowing?.status!}
          currentUser={currentUser}
          user={user}
        />
      )}
    </div>
  );
}
