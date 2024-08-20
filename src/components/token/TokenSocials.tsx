import { FaSquareXTwitter } from "react-icons/fa6";
import { FaTelegram, FaGlobe } from "react-icons/fa";
import Link from "next/link";
import { Token } from "../../types/token/types";

type TokenSocialsParams = {
  token: Token;
};

export default function TokenSocials({ token }: TokenSocialsParams) {
  return (
    <div className="flex gap-x-4 items-center mt-6">
      <Link href={token.twitter || ""}>
        <FaSquareXTwitter size={40} />
      </Link>
      <Link href={token.telegram || ""}>
        <FaTelegram size={40} />
      </Link>
      <Link href={token.website || ""}>
        <FaGlobe size={40} />
      </Link>
    </div>
  );
}
