import { User } from "@prisma/client";
import Image from "next/image";
import CopyButton from "../CopyButton";
import { Address } from "@/lib/types";
import { defaultProfileAvatarUrl } from "@/config/user";
import { TokenWithVoteCount } from "@/types/token/types";
import { sliceAddress } from "@/lib/sliceAddress";
import TokenVote from "./TokenVote";
import TokenSocials from "./TokenSocials";


type TokenInfoParams = {
  token: TokenWithVoteCount;
  creator: User | null;
};

export default function TokenInfo({ token, creator }: TokenInfoParams) {
  return (
    <section className="flex flex-col my-2 gap-y-2">
        <div className="flex items-center gap-x-2">
          <Image
            src={token.image}
            alt="token-image"
            height={60}
            width={60}
            className="rounded-full"
          />

          <p className="text-4xl font-proximaSoftBold">${token.ticker}</p>
        </div>

        <div className="flex items-center gap-x-2">
          <Image
            src={(creator && creator.imageUrl) || defaultProfileAvatarUrl}
            alt="creator-logo"
            height={35}
            width={35}
            className="rounded-full"
          />

          <p>{token.description}</p>
        </div>

        <div className="flex gap-x-10 mt-10">
          <div className="flex flex-col">
            <p className="text-gray text-lg mb-2">Votes</p>
            <TokenVote tokenId={token.id} />
          </div>

          <div className="flex flex-col">
            <p className="text-gray text-lg mb-2">CA</p>
            <div className="flex gap-x-2">
              <p className="text-xl">{sliceAddress(token.tokenAddress)}</p>
              <CopyButton tokenAddress={token.tokenAddress as Address} />
            </div>
          </div>

          <TokenSocials token={token} />
        </div>
      </section>
  );
}
