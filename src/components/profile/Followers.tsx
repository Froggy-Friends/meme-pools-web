import { User } from "@prisma/client";
import UserCard from "./UserCard";

type FollowersProps = {
  followers: User[];
};

export default function Followers({ followers }: FollowersProps) {
  return (
    <section className="flex gap-x-4">
      {followers.map((user) => {
        return <UserCard key={user.id} user={user} />;
      })}
    </section>
  );
}
