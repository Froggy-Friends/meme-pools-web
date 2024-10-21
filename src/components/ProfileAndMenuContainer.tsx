"use client";

import ProfileAvatar from "./ProfileAvatar";
import useUser from "@/hooks/useUser";
import { User } from "@prisma/client";
import MobileMenu from "./MobileMenu";

type NavbarProps = {
  cachedUser: User | null;
};

export default function ProfileAndMenuContainer({ cachedUser }: NavbarProps) {
  const { currentUser } = useUser();

  return (
    <>
      <ProfileAvatar cachedUser={cachedUser || null} currentUser={currentUser || null} />

      <MobileMenu cachedUser={cachedUser || null} currentUser={currentUser || null} />
    </>
  );
}
