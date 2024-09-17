"use client";

import Link from "next/link";
import { FaSquareXTwitter, FaTelegram } from "react-icons/fa6";

export default function HeaderSocialLinks() {
  return (
    <div className="flex items-center gap-x-4 mt-20">
      <Link href="https://t.me/Frog_HQ" target="_blank">
        <FaTelegram size={35} className="hover:text-green hover:scale-[1.03] transition" />
      </Link>
      <Link href="https://x.com/frogdotfun" target="_blank">
        <FaSquareXTwitter size={37} className="hover:text-green hover:scale-[1.03] transition" />
      </Link>
    </div>
  );
}
