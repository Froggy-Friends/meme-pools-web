import { User } from "@prisma/client";
import UserCard from "./UserCard";

type FollowingProps = {
  following: User[];
};

export default function Following({ following }: FollowingProps) {
  return (
    <section className="flex gap-x-4">
      {following.map((user) => {
        return <UserCard key={user.id} user={user} />;
      })}
    </section>
  );
}
