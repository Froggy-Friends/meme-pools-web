import Logo from "./Logo";
import Link from "next/link";
import ProfileAvatar from "./ProfileAvatar";
import HeaderSocialLinks from "./HeaderSocialLinks";
import { cookies } from "next/headers";
import { getUserFromCookies } from "@/app/(main)/profile/[wallet]/queries";

export default async function Header() {
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

      <ProfileAvatar user={user!} />
    </header>
  );
}
