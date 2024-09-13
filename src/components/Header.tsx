import ProfileAvatar from "./ProfileAvatar";
import { cookies } from "next/headers";
import { fetchUser } from "@/queries/profile/queries";
import { Chain } from "@/models/chain";
import ChainSwitcher from "./ChainSwitcher";
import { Cookie } from "@/models/cookie";
import LogoPopover from "./LogoPopover";
import LaunchCoinButton from "./LaunchCoinButton";
import HowItWorksButton from "./HowItWorksButton";

type HeaderProps = {
  chain: Chain;
};

export default async function Header({ chain }: HeaderProps) {
  const cookieStore = cookies();
  const userEvmAddress = cookieStore.get(Cookie.EvmAddress);
  const userSolAddress = cookieStore.get(Cookie.SolanaAddress);
  const user = await fetchUser(
    chain === Chain.Eth ? userEvmAddress?.value : userSolAddress?.value
  );

  return (
    <header className="flex justify-between items-center h-32">
      <LogoPopover />

      <div className="flex items-center gap-x-4">
        <LaunchCoinButton />
        <HowItWorksButton />
        <ChainSwitcher />
        <ProfileAvatar user={user!} />
      </div>
    </header>
  );
}
