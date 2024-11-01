import { User } from "@prisma/client";
import UserCard from "./UserCard";
import Link from "next/link";
import { getUserDisplayName } from "@/lib/getUserDisplayName";

type FollowersProps = {
  followers: User[];
  profileUser: User;
  cachedUser: User | null;
};

export default function Followers({ followers, profileUser, cachedUser }: FollowersProps) {
  return (
    <section className="flex flex-col gap-y-2 mt-6">
      {!followers.length && cachedUser && cachedUser.id !== profileUser.id && (
        <p className="ml-2 -mt-4">
          Be the first to{" "}
          <Link href="#follow-button" className="text-primary hover:text-light-primary transition">
            follow
          </Link>{" "}
          {getUserDisplayName(profileUser.name)}
        </p>
      )}
      {!followers.length && cachedUser && cachedUser.id === profileUser.id && (
        <p className="ml-1 -mt-4">No followers to show</p>
      )}
      {followers.map(user => {
        return <UserCard key={user.id} user={user} view="followers" profileUser={profileUser} />;
      })}
    </section>
  );
}
