import { cookies } from "next/headers";
import { fetchUser } from "@/queries/profile/queries";
import { Chain } from "@/models/chain";
import { Cookie } from "@/models/cookie";
import LogoPopover from "./LogoPopover";
import TokenSearch from "./TokenSearch";
import { Navbar, NavbarBrand, NavbarContent, NavbarMenuToggle } from "@nextui-org/react";
import NavbarIcons from "./NavbarIcons";
import ProfileAndMenuContainer from "./ProfileAndMenuContainer";

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
        <LogoPopover />
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
