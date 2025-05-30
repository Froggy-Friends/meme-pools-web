import { fetchFollow, fetchUser } from "@/queries/profile/queries";
import { User } from "@prisma/client";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { Cookie } from "@/models/cookie";
import { defaultProfileAvatarUrl } from "@/config/user";
import { getTimeDifference } from "@/lib/getTimeDifference";
import { getUserDisplayName } from "@/lib/getUserDisplayName";

type UserCardProps = {
  user: User;
  view: string;
  profileUser: User;
};

export default async function UserCard({ user, view, profileUser }: UserCardProps) {
  const cookieStore = cookies();
  const cachedUserEvmAddress = cookieStore.get(Cookie.EvmAddress);
  const cachedUser = await fetchUser(cachedUserEvmAddress?.value);
  const isFollowing = await fetchFollow(user.id, profileUser.id);
  const isFollowed = await fetchFollow(profileUser.id, user.id);
  const followingTime = getTimeDifference(isFollowing?.followedAt);
  const followedTime = getTimeDifference(isFollowed?.followedAt);

  return (
    <div className="flex items-center justify-between min-w-[365px] max-w-[400px] tablet:min-w-full tablet:w-full laptop:min-w-[700px] laptop:w-[700px] h-[70px] px-4 bg-dark-gray rounded-lg ">
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
          className="text-white/80 font-proximaSoftBold text-lg laptop:text-xl hover:text-white transition"
        >
          {getUserDisplayName(user.name)}
        </Link>

        {view === "followers" && <p className="hidden tablet:block text-gray text-lg">Followed you {followedTime}</p>}
        {view === "following" && <p className="hidden tablet:block text-gray text-lg">Followed {followingTime}</p>}
      </div>

      {cachedUser && cachedUser.id !== user.id && (
        <FollowButton
          isFollowing={isFollowing?.status || "false"}
          cachedUser={cachedUser}
          user={user}
          className="w-28 py-1"
        />
      )}
    </div>
  );
}
