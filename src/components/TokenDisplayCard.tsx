import { TokenWithCreator } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { IoChatbox } from "react-icons/io5";

type TokenDisplayCardProps = {
  token: TokenWithCreator;
};

export default async function TokenDisplayCard({
  token,
}: TokenDisplayCardProps) {
  return (
    <div className="flex flex-grow-0 flex-shrink-0 w-[25%]">
      <Link href={`/token/${token.tokenAddress}`} className="flex gap-x-3 my-2">
        <Image
          src={token.image}
          alt="token-image"
          height={150}
          width={150}
          className="rounded-md"
        />

        <div className="flex flex-col">
          {token.creator && (
            <div className="flex gap-x-2">
              <Image
                src={token.creator.imageUrl!}
                alt="creator avatar"
                height={20}
                width={20}
                className="rounded-md"
              />
              <p>Created by {token.creator.name}</p>
            </div>
          )}

          <p>market cap...</p>
          <div className="flex gap-x-2 items-center">
            <IoChatbox size={20} />
            {token._count.Comment}
          </div>
          <p>
            {token.name}({token.ticker}): {token.description}
          </p>
        </div>
      </Link>
    </div>
  );
}
