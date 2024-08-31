import { User } from "@prisma/client";
import UserCard from "./UserCard";

type FollowersProps = {
  followers: User[];
  profileUser: User;
};

export default function Followers({ followers, profileUser }: FollowersProps) {
  return (
    <section className="flex flex-col gap-y-2 mt-6">
      {followers.map((user) => {
        return (
          <UserCard
            key={user.id}
            user={user}
            view="followers"
            profileUser={profileUser}
          />
        );
      })}
    </section>
  );
}
