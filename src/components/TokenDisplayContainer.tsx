import useTokens from "@/hooks/useTokens";
import { TokenFilter } from "@/models/token";
import TokenDisplayCard from "./TokenDisplayCard";

type TokenDisplayContainerProps = {
  filter: TokenFilter;
  page: number;
  reverse: boolean;
  isNsfw: boolean;
};

export default function TokenDisplayContainer({ filter, page, reverse, isNsfw }: TokenDisplayContainerProps) {
  const { tokens } = useTokens({
    filter,
    page,
    reverse,
    isNsfw,
  });
  if (!tokens || tokens.length === 0) return null;
  return (
    <section className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5 gap-3 tablet:gap-4 laptop:gap-3">
      {tokens.map(token => {
        return <TokenDisplayCard key={token.id} token={token} />;
      })}
    </section>
  );
}
