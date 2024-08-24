import { fetchTokens } from "@/queries/token/queries";
import TokenDisplayCard from "./TokenDisplayCard";
import TokenCarousel from "./TokenCarousel";
import Link from "next/link";
import { tokenCarouselLength } from "@/config/base/token";
import { Chain } from "@/models/chain";

type TokenDisplayContainerProps = {
  chain: Chain;
};

export default async function TokenDisplayContainer({
  chain,
}: TokenDisplayContainerProps) {
  const newTokens = await fetchTokens("new", 1);
  const trendingTokens = await fetchTokens("trending", 1);
  const volumeTokens = await fetchTokens("volume", 1);
  const transactionTokens = await fetchTokens("transactions", 1);
  const commentTokens = await fetchTokens("comments", 1);
  const votesTokens = await fetchTokens("votes", 1);
  const linkStyles =
    "-mb-3 text-xl text-xl font-proximaSoftBold w-40 hover:underline hover:text-white/80";

  return (
    <section className="flex flex-col mt-20">
      <Link href={`${chain}/tokens/votes?page=1`} className={linkStyles}>
        Top Votes
      </Link>
      <TokenCarousel>
        {votesTokens && votesTokens.slice(0, tokenCarouselLength).map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </TokenCarousel>

      <Link href={`${chain}/tokens/comments?page=1`} className={linkStyles}>
        Top Comments
      </Link>
      <TokenCarousel>
        {commentTokens && commentTokens.slice(0, tokenCarouselLength).map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </TokenCarousel>

      <Link href={`${chain}/tokens/volume?page=1`} className={linkStyles}>
        Top Volume
      </Link>
      <TokenCarousel>
        {volumeTokens && volumeTokens.slice(0, tokenCarouselLength).map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </TokenCarousel>

      <Link href={`${chain}/tokens/transactions?page=1`} className={linkStyles}>
        Top Transactions
      </Link>
      <TokenCarousel>
        {transactionTokens && transactionTokens.slice(0, tokenCarouselLength).map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </TokenCarousel>

      <Link href={`${chain}/tokens/trending?page=1`} className={linkStyles}>
        Trending
      </Link>
      <TokenCarousel>
        {trendingTokens && trendingTokens.slice(0, tokenCarouselLength).map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </TokenCarousel>

      <Link href={`${chain}/tokens/comments?page=1`} className={linkStyles}>
        Newest
      </Link>
      <TokenCarousel>
        {newTokens && newTokens.slice(0, tokenCarouselLength).map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </TokenCarousel>
    </section>
  );
}
