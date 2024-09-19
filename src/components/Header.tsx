import ProfileAvatar from "./ProfileAvatar";
import { cookies, headers } from "next/headers";
import { fetchUser } from "@/queries/profile/queries";
import { Chain } from "@/models/chain";
import ChainSwitcher from "./ChainSwitcher";
import { Cookie } from "@/models/cookie";
import LogoPopover from "./LogoPopover";
import LaunchCoinButton from "./LaunchCoinButton";
import HowItWorksButton from "./HowItWorksButton";
import TokenSearch from "./TokenSearch";
import { usePathname } from "next/navigation";

type HeaderProps = {
  chain: Chain;
  showSearch?: boolean;
};

export default async function Header({ chain, showSearch }: HeaderProps) {
  const cookieStore = cookies();
  const userEvmAddress = cookieStore.get(Cookie.EvmAddress);
  const userSolAddress = cookieStore.get(Cookie.SolanaAddress);
  const user = await fetchUser(chain === Chain.Eth ? userEvmAddress?.value : userSolAddress?.value);

  return (
    <header className="flex justify-between items-center h-20">
      <LogoPopover />

      {showSearch && <TokenSearch classNames="justify-center" />}

      <div className="flex items-center gap-x-4">
        <LaunchCoinButton />
        <HowItWorksButton />
        <ChainSwitcher />
        <ProfileAvatar user={user!} />
      </div>
    </header>
  );
}
