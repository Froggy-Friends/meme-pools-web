"use client";

import Link from "next/link";
import { FaSquareXTwitter, FaTelegram } from "react-icons/fa6";

export default function HeaderSocialLinks() {
  return (
    <div className="flex items-center gap-x-4 mt-14">
      <FaTelegram
        size={35}
        className="hover:text-white/80 hover:scale-[1.03] transition"
      />
      <Link href="https://x.com/frogdotfun" target="_blank">
        <FaSquareXTwitter
          size={37}
          className="hover:text-white/80 hover:scale-[1.03] transition"
        />
      </Link>
    </div>
  );
}
