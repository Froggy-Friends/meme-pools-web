import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type UserCardProps = {
  user: User;
};

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="flex items-center gap-x-2 border border-black rounded-lg p-3">
      <Image
        src={user.imageUrl!}
        alt="User profile image"
        height={30}
        width={30}
        className="rounded-full"
      />
      <Link href={`/profile/${user.ethAddress}`} className="hover:underline">
        {user.name}
      </Link>
    </div>
  );
}
