import Image from "next/image";
import { Token } from "@/lib/types";
import { fetchUserById } from "@/lib/actions";
import Link from "next/link";

type TokenDisplayCardProps = {
  token: Token;
};

export default async function TokenDisplayCard({
  token,
}: TokenDisplayCardProps) {
  const tokenCreator = await fetchUserById(token.userId);

  return (
    <Link
      href={`/token/${token.tokenAddress}`}
      className="flex gap-x-3 w-[31%] pb-10 animate-fadeInSlideUp"
    >
      <Image src={token.image} alt="token-image" height={100} width={100} />

      <div className="flex flex-col">
        {tokenCreator && (
          <div className="flex gap-x-2">
            <Image
              src={tokenCreator.imageUrl!}
              alt="creator avatar"
              height={20}
              width={20}
              className="rounded-md"
            />
            <p>Created by {tokenCreator.name}</p>
          </div>
        )}

        <p>market cap...</p>
        <p>replies...</p>
        <p>
          {token.name}({token.ticker}): {token.description}
        </p>
      </div>
    </Link>
  );
}
