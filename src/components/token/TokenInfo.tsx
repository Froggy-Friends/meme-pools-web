import { User } from "@prisma/client";
import Image from "next/image";
import { defaultProfileAvatarUrl } from "@/config/user";
import { TokenWithVoteCount } from "@/types/token/types";

type TokenInfoParams = {
  token: TokenWithVoteCount;
  creator: User | null;
  cachedUser: User | null;
};

export default function TokenInfo({ token, creator }: TokenInfoParams) {
  return (
    <section className="flex flex-col w-full my-2 gap-y-4 pb-14">
      <div className="flex items-center gap-4">
        <Image src={token.image} alt="token-image" height={50} width={50} className="h-[50px] w-[50px] rounded-3xl" />
        <p className="text-6xl font-proximaSoftBold">${token.ticker}</p>
      </div>

      <div className="flex items-center gap-x-2">
        <Image
          src={(creator && creator.imageUrl) || defaultProfileAvatarUrl}
          alt="creator-logo"
          height={18}
          width={18}
          className="rounded-full"
        />

        <p>{token.description}</p>
      </div>
    </section>
  );
}
