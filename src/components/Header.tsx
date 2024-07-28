"use client";

import Logo from "./Logo";
import ConnectButton from "./ConnectButton";
import Link from "next/link";
import ProfileAvatar from "./ProfileAvatar";
import HeaderSocialLinks from "./HeaderSocialLinks";
import { useAccount } from "wagmi";

export default function Header() {
  const { isConnected } = useAccount();

  return (
    <header className="flex justify-between items-center h-32 px-12">
      <div className="flex gap-x-3 items-center">
        <Link href="/">
          <Logo />
        </Link>
        <HeaderSocialLinks />
      </div>

      {!isConnected ? <ConnectButton /> : <ProfileAvatar />}
    </header>
  );
}
