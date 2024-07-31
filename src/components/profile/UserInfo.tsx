"use client";

import { User } from "@/lib/types";
import Image from "next/image";
import ProfileModal from "../ProfileModal";
import { useDisclosure } from "@nextui-org/react";
import Link from "next/link";

type UserInfoParams = {
  user: User;
};

export default function UserInfo({ user }: UserInfoParams) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <section className="items-center">
      <div className="flex items-center gap-x-4 pb-4">
        <Image
          src={user!.imageUrl!}
          alt="user-avatar"
          height={40}
          width={40}
          className="rounded-full"
        />
        <p className="text-lg font-semibold">{user?.name}</p>
        <button
          onClick={() => onOpen()}
          className="p-2 border border-black rounded-lg font-semibold"
        >
          Edit profile
        </button>
      </div>

      <p className="pb-2">{user.wallet}</p>

      <Link
        href={`https://etherscan.io/address/${user.wallet}`}
        className="hover:underline"
        target="_blank"
      >
        View on Etherscan
      </Link>

      <ProfileModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />
    </section>
  );
}
