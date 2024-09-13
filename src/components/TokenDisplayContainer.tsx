import useTokens from "@/hooks/useTokens";
import { Chain } from "@/models/chain";
import { TokenFilter } from "@/models/token";
import TokenDisplayCard from "./TokenDisplayCard";

type TokenDisplayContainerProps = {
  chain: Chain;
  filter: TokenFilter;
  page: number;
  onPageChange: (page: number) => void;
};

export default function TokenDisplayContainer({
  chain,
  filter,
  page,
  onPageChange,
}: TokenDisplayContainerProps) {
  const { tokens } = useTokens(filter, page);
  if (!tokens || tokens.length === 0) return null;
  return (
    <section className="grid grid-cols-9 gap-5">
      {tokens.map((token) => {
        return <TokenDisplayCard key={token.id} token={token} />;
      })}
    </section>
  );
}
