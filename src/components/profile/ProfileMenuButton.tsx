"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

type ProfileMenuButtonProps = {
  view: string;
  profileUser: User;
};

export default function ProfileMenuButton({
  view,
  profileUser,
}: ProfileMenuButtonProps) {
  const router = useRouter();

  return (
    <button
      className="border border-black rounded-lg p-2"
      onClick={() =>
        router.push(`/profile/${profileUser.name}?view=${view.toLowerCase()}`)
      }
    >
      {view}
    </button>
  );
}
