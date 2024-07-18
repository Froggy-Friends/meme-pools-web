import { FaSquareXTwitter } from "react-icons/fa6";
import { FaTelegram, FaGlobe } from "react-icons/fa";
import Link from "next/link";

export default function TokenSocials() {
  return (
    <div className="flex gap-x-4 items-center mt-6">
      <Link href="">
        <FaSquareXTwitter size={40} />
      </Link>
      <Link href="">
        <FaTelegram size={40} />
      </Link>
      <Link href="">
        <FaGlobe size={40} />
      </Link>
    </div>
  );
}
