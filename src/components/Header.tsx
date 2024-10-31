import { cookies } from "next/headers";
import { fetchUser } from "@/queries/profile/queries";
import { Chain } from "@/models/chain";
import { Cookie } from "@/models/cookie";
import TokenSearch from "./TokenSearch";
import { Link, Navbar, NavbarBrand, NavbarContent, NavbarMenuToggle } from "@nextui-org/react";
import NavbarIcons from "./NavbarIcons";
import ProfileAndMenuContainer from "./ProfileAndMenuContainer";
import Logo from "./Logo";
import { FaXTwitter } from "react-icons/fa6";

type HeaderProps = {
  chain: Chain;
};

export default async function Header({ chain }: HeaderProps) {
  const cookieStore = cookies();
  const userEvmAddress = cookieStore.get(Cookie.EvmAddress);
  const userSolAddress = cookieStore.get(Cookie.SolanaAddress);
  const user = await fetchUser(chain === Chain.Eth ? userEvmAddress?.value : userSolAddress?.value);

  return (
    <Navbar
      className="bg-dark flex justify-between items-center w-full h-20 mb-12 laptop:mb-24"
      maxWidth="full"
      classNames={{ wrapper: "px-0" }}
    >
      <NavbarBrand>
        <Logo height={70} width={70} />
        <p className="hidden laptop:block text-2xl font-allumiBold">Meme Pools</p>
        <Link
          href="https://x.com/memepoolsx"
          target="_blank"
          className="text-white hidden tablet:block mt-[0.1rem] laptop:mt-1 tablet:ml-4 laptop:ml-6"
        >
          <FaXTwitter className="w-4 h-4 tablet:w-6 tablet:h-6 text-white hover:text-primary hover:scale-[1.03] transition" />
        </Link>
      </NavbarBrand>

      <NavbarContent justify="center">
        <TokenSearch />
      </NavbarContent>

      <NavbarContent justify="end">
        <div className="flex items-center gap-x-1 tablet:gap-x-2">
          <NavbarIcons />
          <ProfileAndMenuContainer cachedUser={user || null} />
        </div>
      </NavbarContent>
      <NavbarMenuToggle className="bg-dark tablet:hidden" />
    </Navbar>
  );
}
