import { cookies } from "next/headers";
import { fetchUser } from "@/queries/profile/queries";
import { Chain } from "@/models/chain";
import { Cookie } from "@/models/cookie";
import LogoPopover from "./LogoPopover";
import TokenSearch from "./TokenSearch";
import Navbar from "./Navbar";

type HeaderProps = {
  chain: Chain;
};

export default async function Header({ chain }: HeaderProps) {
  const cookieStore = cookies();
  const userEvmAddress = cookieStore.get(Cookie.EvmAddress);
  const userSolAddress = cookieStore.get(Cookie.SolanaAddress);
  const user = await fetchUser(chain === Chain.Eth ? userEvmAddress?.value : userSolAddress?.value);

  return (
    <header className="flex justify-between items-center w-full h-20 mb-12 laptop:mb-24">
      <LogoPopover />

      <TokenSearch />

      <Navbar cachedUser={user || null} />
    </header>
  );
}
