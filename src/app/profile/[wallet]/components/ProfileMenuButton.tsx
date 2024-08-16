"use client";

import { useRouter } from "next/navigation";

type ProfileMenuButtonProps = {
  name: string;
  profileAddress: string;
};

export default function ProfileMenuButton({
  name,
  profileAddress,
}: ProfileMenuButtonProps) {
  const router = useRouter();

  return (
    <button
      className="border border-black rounded-lg p-2"
      onClick={() =>
        router.push(`/profile/${profileAddress}?view=${name.toLowerCase()}`)
      }
    >
      {name}
    </button>
  );
}
