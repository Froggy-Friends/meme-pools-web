import { tokenCarouselLength } from "@/config/base/token";
import { Chain } from "@/models/chain";
import { fetchTokens } from "@/queries/token/queries";
import TokenDisplayCard from "./TokenDisplayCard";

type TokenDisplayContainerProps = {
  chain: Chain;
};

export default async function TokenDisplayContainer({
  chain,
}: TokenDisplayContainerProps) {
  const newTokens = await fetchTokens("new", 1);

  return (
    <section className="grid grid-cols-9 gap-5">
      {newTokens.slice(0, tokenCarouselLength).map((token) => {
        return <TokenDisplayCard key={token.id} token={token} />;
      })}
    </section>
  );
}
