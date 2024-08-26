import { fetchFollow, fetchUser } from "@/queries/profile/queries";
import { User } from "@prisma/client";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { Cookie } from "@/models/cookie";
import { defaultProfileAvatarUrl, usernameDisplayLength } from "@/config/user";
import { getDateDifference } from "@/lib/getDateDifference";

type UserCardProps = {
  user: User;
  view: string;
};

export default async function UserCard({ user, view }: UserCardProps) {
  const cookieStore = cookies();
  const userEvmAddress = cookieStore.get(Cookie.EvmAddress);
  const currentUser = await fetchUser(userEvmAddress?.value);
  const isFollowing =
    currentUser && (await fetchFollow(user.id, currentUser?.id));
  const isFollowed =
    currentUser && (await fetchFollow(currentUser?.id, user.id));
  const followingTime = getDateDifference(isFollowing?.followedAt);
  const followedTime = getDateDifference(isFollowed?.followedAt);

  return (
    <div className="flex items-center justify-between w-[700px] h-[70px]  px-4 bg-dark-gray rounded-lg ">
      <div className="flex items-center gap-x-3">
        <Image
          src={(user && user.imageUrl) || defaultProfileAvatarUrl}
          alt="User profile image"
          height={45}
          width={45}
          className="rounded-full"
        />
        <Link
          href={`/profile/${user.name}`}
          className="hover:underline font-proximaSoftBold text-xl"
        >
          {user.name.length > usernameDisplayLength
            ? user.name.substring(0, usernameDisplayLength) + "..."
            : user.name}
        </Link>

        {view === "followers" && (
          <p className="text-gray text-xl">Followed you {followedTime} ago</p>
        )}
        {view === "following" && (
          <p className="text-gray text-xl">Followed {followingTime} ago</p>
        )}
      </div>

      {currentUser && currentUser.id !== user.id && (
        <FollowButton
          isFollowing={isFollowing?.status || "false"}
          currentUser={currentUser}
          user={user}
          className="w-28 py-[0.375rem]"
        />
      )}
    </div>
  );
}
