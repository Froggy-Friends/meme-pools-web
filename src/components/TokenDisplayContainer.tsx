import TokenDisplayCard from "./TokenDisplayCard";
import PaginationControls from "./PaginationControls";
import TokenDisplayControls from "./TokenDisplayControls";
import { fetchTokenCount, fetchTokens } from "@/app/token/[tokenAddress]/queries";

type TokenDisplayContainerProps = {
  page: number;
  tokenFilter: string;
};

export default async function TokenDisplayContainer({
  page,
  tokenFilter,
}: TokenDisplayContainerProps) {
  const tokenCount = await fetchTokenCount();
  const tokens = await fetchTokens(tokenFilter, page);

  const getPreviousPath = () => {
    return page > 1 ? `/${tokenFilter}?page=${page - 1}` : "";
  };

  const getNextPath = () => {
    return tokenCount > 100 * page ? `/${tokenFilter}?page=${page + 1}` : "";
  };

  const previousPath = getPreviousPath();
  const nextPath = getNextPath();

  return (
    <section className="flex flex-col">
      <div className="flex gap-x-6 mt-12">
        <TokenDisplayControls />
        <PaginationControls previousPath={previousPath} nextPath={nextPath} />
      </div>

      <div className="flex flex-wrap justify-between w-full mt-12">
        {tokens!.map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </div>
    </section>
  );
}
