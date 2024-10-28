import Link from "next/link";
import Logo from "./Logo";
import { FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BsGlobe } from "react-icons/bs";

export default function Footer() {
  return (
    <footer className="h-[75px] laptop:h-[120px] w-full mt-auto mb-4 laptop:mb-0 flex items-center justify-between">
      <div className="flex flex-col text-white/80 text-[10px] tablet:text-sm">
        <Link href="https://docs.memepools.com" className="hover:text-white transition" target="_blank">
          Docs
        </Link>
        <Link href="https://docs.memepools.com/terms" className="hover:text-white transition" target="_blank">
          Terms
        </Link>
      </div>

      <div className="flex flex-col justify-center items-center ml-[42px] text-[10px] tablet:text-sm">
        <Logo height={40} width={40} />
        <p className="font-allumiBold">&copy; Memepools 2024</p>
      </div>

      <div className="flex items-center gap-3 laptop:gap-4 text-white/80">
        <Link href="https://x.com/memepoolsx">
          <FaXTwitter className="w-[16px] h-[16px] hover:text-white hover:scale-[1.03] transition" />
        </Link>
        <Link href="">
          <BsGlobe className="w-[16px] h-[16px] hover:text-white hover:scale-[1.03] transition" />
        </Link>
        <Link href="https://t.me/Frog_HQ">
          <FaTelegram className="w-[16px] h-[16px] hover:text-white hover:scale-[1.03] transition" />
        </Link>
      </div>
    </footer>
  );
}
