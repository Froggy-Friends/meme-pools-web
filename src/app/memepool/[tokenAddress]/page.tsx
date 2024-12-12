import React from "react";
import Header from "@/components/Header";
import { Chain } from "@/models/chain";
import { cookies } from "next/headers";
import { Cookie } from "@/models/cookie";
import { fetchTokenByAddress } from "@/queries/token/queries";
import { redirect } from "next/navigation";
import InfoAndPostContainer from "@/components/memepool/InfoAndPostContainer";
import PostContainer from "@/components/memepool/PostContainer";
import Image from "next/image";
import { getPosts } from "@/queries/memepool/queries";
import PlaceHolder from "@/components/memepool/PlaceHolder";

type MemePoolPageProps = {
  params: {
    tokenAddress: string;
  };
};

export default async function MemePool({ params }: MemePoolPageProps) {
  const cookieStore = cookies();
  const cachedUserSolanaAddress = cookieStore.get(Cookie.SolanaAddress);
  const chain = cachedUserSolanaAddress?.value ? Chain.Solana : Chain.Eth;
  const token = await fetchTokenByAddress(params.tokenAddress);
  const posts = await getPosts(token?.id);

  if (!token) {
    redirect("/");
  }

  return (
    <main className="flex flex-col min-h-[100vh] max-w-[410px] tablet:max-w-[750px] laptop:max-w-[924px] desktop:max-w-[1200px] mx-auto px-2 tablet:px-4">
      <Header chain={chain} />

      {token.bannerImage && (
        <div className="w-full aspect-[3/1] laptop:aspect-[4/1] relative mb-12">
          <Image src={token.bannerImage} alt="token-image" fill className="object-cover rounded-xl" />
        </div>
      )}

      <InfoAndPostContainer token={token} />

      {posts.length > 0 ? <PostContainer tokenId={token.id} /> : <PlaceHolder />}
    </main>
  );
}
