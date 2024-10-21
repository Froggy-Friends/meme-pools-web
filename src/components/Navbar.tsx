"use client";
import LaunchCoinButton from "./LaunchCoinButton";
import HowItWorksButton from "./HowItWorksButton";
import { BsQuestionCircle } from "react-icons/bs";
import ChainSwitcher from "./ChainSwitcher";
import ProfileAvatar from "./ProfileAvatar";
import useUser from "@/hooks/useUser";
import { User } from "@prisma/client";
import MobileMenu from "./MobileMenu";

type NavbarProps = {
  cachedUser: User | null;
};

export default function Navbar({ cachedUser }: NavbarProps) {
  const { currentUser } = useUser();

  return (
    <>
      <div className="hidden tablet:flex items-center gap-x-1 tablet:gap-x-2">
        <LaunchCoinButton />
        <HowItWorksButton>
          <BsQuestionCircle size={25} className="text-light-gray transition" />
        </HowItWorksButton>
        <ChainSwitcher />
        <ProfileAvatar cachedUser={cachedUser || null} currentUser={currentUser || null} />
      </div>

      <MobileMenu cachedUser={cachedUser || null} currentUser={currentUser || null} />
    </>
  );
}
