import { User } from "@prisma/client";
import UserCard from "./UserCard";

type FollowingProps = {
  following: User[];
  profileUser: User;
};

export default function Following({ following, profileUser }: FollowingProps) {
  return (
    <section className="flex flex-col gap-y-2 mt-6">
      {following.map((user) => {
        return (
          <UserCard
            key={user.id}
            user={user}
            view="following"
            profileUser={profileUser}
          />
        );
      })}
    </section>
  );
}
