import { FaXTwitter } from "react-icons/fa6";
import { FaTelegram, FaGlobe } from "react-icons/fa";
import Link from "next/link";
import { Token } from "@prisma/client";


type TokenSocialsParams = {
  token: Token;
};

export default function TokenSocials({ token }: TokenSocialsParams) {
  const linkStyles = "bg-dark-gray rounded-3xl py-[0.375rem] px-6 hover:bg-gray transition";

  return (
    <div className="flex gap-x-2 items-center mt-6">
      <Link href={token.twitter || ""} className={linkStyles}>
        <FaXTwitter size={23} />
      </Link>
      <Link href={token.telegram || ""} className={linkStyles}>
        <FaTelegram size={25} />
      </Link>
      <Link href={token.website || ""} className={linkStyles}>
        <FaGlobe size={25} />
      </Link>
    </div>
  );
}
