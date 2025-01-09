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
import Footer from "@/components/Footer";

type MemePoolPageProps = {
  params: {
    tokenAddress: string;
  };
};

export default async function MemePool({ params }: MemePoolPageProps) {
  const cookieStore = cookies();
  const chain = cookieStore.get(Cookie.Chain)?.value as Chain || Chain.Base;
  const token = await fetchTokenByAddress(params.tokenAddress, chain as Chain);

  if (!token) {
    redirect("/");
  }

  return (
    <main className="flex flex-col min-h-[100vh] max-w-[410px] tablet:max-w-[750px] laptop:max-w-[924px] desktop:max-w-[1200px] mx-auto px-2 tablet:px-4">
      <Header chain={chain} />

      {token.bannerImage && (
        <Image
          src={token.bannerImage}
          alt="token-image"
          height={200}
          width={1280}
          className="rounded-xl mb-12 h-[120px] tablet:h-[150px] laptop:h-[250px] object-cover"
        />
      )}

      <InfoAndPostContainer token={token} />

      <PostContainer tokenId={token.id} />

      <Footer />
    </main>
  );
}
