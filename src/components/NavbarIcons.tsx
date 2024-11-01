import CreateCoinButton from "./CreateCoinButton";
import HowItWorksButton from "./HowItWorksButton";
import { BsQuestionCircle } from "react-icons/bs";
import ChainSwitcher from "./ChainSwitcher";

export default function NavbarIcons() {
  return (
    <div className="hidden tablet:flex items-center gap-x-1 tablet:gap-x-2">
      <CreateCoinButton />
      <HowItWorksButton>
        <BsQuestionCircle size={25} className="text-light-gray transition" />
      </HowItWorksButton>
      <ChainSwitcher />
    </div>
  );
}
