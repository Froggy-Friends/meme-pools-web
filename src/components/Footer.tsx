import Link from "next/link";
import Logo from "./Logo";
import { FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiGitbook } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="h-[75px] laptop:h-[120px] w-full mt-auto mb-4 laptop:mb-0 flex items-center justify-between">
      <div className="flex flex-row justify-center items-center text-sm tablet:text-sm">
        <Logo height={40} width={40} />
        <p className="font-allumiBold">&copy; Meme Pools 2024</p>
      </div>

      <div className="flex items-center gap-3 laptop:gap-4 text-white/80">
        <Link href="https://x.com/memepoolsx" target="_blank">
          <FaXTwitter className="w-[16px] h-[16px] hover:text-white hover:scale-[1.03] transition" />
        </Link>
        <Link href="https://t.me/Frog_HQ" target="_blank">
          <FaTelegram className="w-[16px] h-[16px] hover:text-white hover:scale-[1.03] transition" />
        </Link>
        <Link href="https://docs.memepools.com" target="_blank">
          <SiGitbook className="w-[16px] h-[16px] hover:text-white hover:scale-[1.03] transition" />
        </Link>
      </div>
    </footer>
  );
}
