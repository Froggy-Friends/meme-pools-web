import { fetchTokens } from "@/app/token/[tokenAddress]/queries";
import TokenDisplayCard from "./TokenDisplayCard";
import TokenCarousel from "./TokenCarousel";
import Link from "next/link";
import { tokenCarouselLength } from "@/config/token";

export default async function TokenDisplayContainer() {
  const newTokens = await fetchTokens("new", 1);
  const trendingTokens = await fetchTokens("trending", 1);
  const volumeTokens = await fetchTokens("volume", 1);
  const transactionTokens = await fetchTokens("transactions", 1);
  const commentTokens = await fetchTokens("comments", 1);

  return (
    <section className="flex flex-col">
      <Link href="/tokens/new?page=1" className="mb-2 text-xl hover:underline">
        New
      </Link>
      <TokenCarousel>
        {newTokens!.slice(0, tokenCarouselLength).map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </TokenCarousel>

      <Link
        href="/tokens/trending?page=1"
        className="mb-2 text-xl hover:underline"
      >
        Trending
      </Link>
      <TokenCarousel>
        {trendingTokens!.slice(0, tokenCarouselLength).map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </TokenCarousel>

      <Link
        href="/tokens/volume?page=1"
        className="mb-2 text-xl hover:underline"
      >
        Volume
      </Link>
      <TokenCarousel>
        {volumeTokens!.slice(0, tokenCarouselLength).map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </TokenCarousel>

      <Link
        href="/tokens/transactions?page=1"
        className="mb-2 text-xl hover:underline"
      >
        Transactions
      </Link>
      <TokenCarousel>
        {transactionTokens!.slice(0, tokenCarouselLength).map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </TokenCarousel>

      <Link
        href="/tokens/comments?page=1"
        className="mb-2 text-xl hover:underline"
      >
        Comments
      </Link>
      <TokenCarousel>
        {commentTokens!.slice(0, tokenCarouselLength).map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </TokenCarousel>
    </section>
  );
}
