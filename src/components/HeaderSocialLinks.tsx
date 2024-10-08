"use client";

import Link from "next/link";
import { FaTelegram, FaXTwitter } from "react-icons/fa6";

export default function HeaderSocialLinks() {
  return (
    <div className="flex items-center gap-x-4 mt-10 laptop:mt-20">
      <Link href="https://x.com/frogdotfun" target="_blank">
        <FaXTwitter className="w-6 h-6 laptop:w-8 laptop:h-8 hover:text-green hover:scale-[1.03] transition" />
      </Link>
      <Link href="https://t.me/Frog_HQ" target="_blank">
        <FaTelegram className="w-6 h-6 laptop:w-8 laptop:h-8 hover:text-green hover:scale-[1.03] transition" />
      </Link>
    </div>
  );
}
