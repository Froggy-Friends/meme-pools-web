import { defaultProfileAvatarUrl } from "@/config/user";
import { getTimeDifference } from "@/lib/getTimeDifference";
import { getUserDisplayName } from "@/lib/getUserDisplayName";
import { MemeWithUser } from "@/types/token/types";
import Image from "next/image";
import Link from "next/link";

type TokenMemeProps = {
  meme: MemeWithUser;
  isNew?: boolean;
};

export default function TokenMeme({ meme, isNew }: TokenMemeProps) {
  return (
    <div className={`flex flex-col rounded-lg bg-dark p-4 mb-2 ${isNew ? "animate-primaryPulse" : ""}`}>
      <div className="flex items-center justify-between w-full max-h-[200px] mb-1">
        <div className="flex items-center gap-x-4">
          <Image
            src={meme.user.imageUrl || defaultProfileAvatarUrl}
            alt="user-profile-picture"
            height={50}
            width={50}
            className="rounded-full"
          />

          <div className="flex flex-col">
            <div className="flex gap-x-4">
              <Link
                href={`/profile/${meme.user.name}`}
                className="font-quatroBold text-white/80 hover:text-white hover:underline transition"
              >
                {getUserDisplayName(meme.user.name)}
              </Link>
              <p className="text-gray">{getTimeDifference(meme.createdAt)}</p>
            </div>

            <p className="overflow-y-auto">{meme.caption}</p>
          </div>
        </div>
      </div>

      <Image src={meme.imageUrl} alt="meme" height={150} width={150} className="rounded-lg mt-2 ml-16" />
    </div>
  );
}
