import Logo from "./Logo";
import Link from "next/link";
import ProfileAvatar from "./ProfileAvatar";
import HeaderSocialLinks from "./HeaderSocialLinks";
import { cookies } from "next/headers";
import { getUserFromCookies } from "@/queries/profile/queries";
import { Chains } from "@/models/chains";
import ChainSwitcher from "./ChainSwitcher";

type HeaderProps = {
  chain: Chains
}

export default async function Header({ chain }: HeaderProps) {
  const cookieStore = cookies();
  const user = await getUserFromCookies(cookieStore);

  return (
    <header className="flex justify-between items-center h-32 px-12">
      <div className="flex gap-x-3 items-center">
        <Link href="/">
          <Logo />
        </Link>
        <HeaderSocialLinks />
      </div>
      
      <div className="flex items-center gap-x-4">
        <ChainSwitcher chain={chain} />
        <ProfileAvatar user={user!} chain={chain}/>
      </div>
    </header>
  );
}
