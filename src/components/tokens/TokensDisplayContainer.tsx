import TokenDisplayCard from "@/components/TokenDisplayCard";
import PaginationControls from "./PaginationControls";
import { fetchTokenCount, fetchTokens } from "@/queries/token/queries";
import { Chain } from "@/models/chain";

type TokesnDisplayContainerProps = {
  filter: string;
  page: number;
  chain: Chain;
};

export default async function TokensDisplayContainer({
  filter,
  page,
  chain,
}: TokesnDisplayContainerProps) {
  const tokenCount = await fetchTokenCount();
  const tokens = await fetchTokens(filter, page);

  const getPreviousPath = () => {
    return page > 1 ? `/?sortBy=${filter}&page=${page - 1}` : "";
  };

  const getNextPath = () => {
    return tokenCount > 100 * page ? `/?sortBy=${filter}&page=${page + 1}` : "";
  };

  const previousPath = getPreviousPath();
  const nextPath = getNextPath();
  return (
    <section className="flex flex-col">
      <h2 className="text-2xl mb-10">
        {filter.charAt(0).toUpperCase() + filter.slice(1)}
      </h2>
      <PaginationControls previousPath={previousPath} nextPath={nextPath} />

      <div className="flex flex-wrap justify-between w-full mt-12">
        {tokens!.map((token) => {
          return (
            <TokenDisplayCard key={token.id} token={token} chain={chain} />
          );
        })}
      </div>
    </section>
  );
}
