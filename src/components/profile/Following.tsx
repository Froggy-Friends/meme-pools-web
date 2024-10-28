import { User } from "@prisma/client";
import UserCard from "./UserCard";

type FollowingProps = {
  following: User[];
  profileUser: User;
  cachedUser: User | null;
};

export default function Following({ following, profileUser, cachedUser }: FollowingProps) {
  return (
    <section className="flex flex-col gap-y-2 mt-6">
      {!following.length && cachedUser && cachedUser.id === profileUser.id && (
        <p className="ml-1 -mt-4">Follow your first user</p>
      )}
      {!following.length && cachedUser && cachedUser.id !== profileUser.id && (
        <p className="ml-1 -mt-4">Not following any users</p>
      )}
      {following.map(user => {
        return <UserCard key={user.id} user={user} view="following" profileUser={profileUser} />;
      })}
    </section>
  );
}
