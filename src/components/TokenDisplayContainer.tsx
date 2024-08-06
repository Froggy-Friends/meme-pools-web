
import TokenDisplayCard from "./TokenDisplayCard";
import PaginationControls from "./PaginationControls";
import TokenDisplayControls from "./TokenDisplayControls";
import { fetchPaginatedTokens, fetchTokens } from "@/app/token/[tokenAddress]/queries";

type TokenDisplayContainerProps = {
  cursor: number;
  page: number;
  filter: string;
};

export default async function TokenDisplayContainer({
  cursor,
  page,
  filter,
}: TokenDisplayContainerProps) {
  const take = 3;

  let { tokens, totalCount } = await fetchTokens(take);

  if (cursor && cursor !== totalCount + 1) {
    tokens = await fetchPaginatedTokens(take, cursor);
  }

  let previousPathCursor: number | null = null;
  let nextPathCursor: number | null = null;

  if (tokens.length > 1) {
    previousPathCursor = Number(tokens[0].tokenId) + take + 1;
    nextPathCursor = tokens[take - 1].tokenId;
  }

  const getPreviousPath = () => {
    return page > 1 ? `?page=${page - 1}&cursor=${previousPathCursor}` : "";
  };

  const getNextPath = () => {
    return totalCount > take * page
      ? `?page=${page + 1}&cursor=${nextPathCursor}`
      : "";
  };

  const previousPath = getPreviousPath();
  const nextPath = getNextPath();

  return (
    <section className="flex flex-col">
      <div className="flex gap-x-6 mt-12">
        <TokenDisplayControls/>
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
