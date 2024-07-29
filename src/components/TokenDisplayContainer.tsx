import { fetchTokens } from "@/lib/actions";
import TokenDisplayCard from "./TokenDisplayCard";
import PaginationControls from "./PaginationControls";
import TokenDisplayControls from "./TokenDisplayControls";

type TokenDisplayContainerProps = {
  page: number;
};

export default async function TokenDisplayContainer({
  page,
}: TokenDisplayContainerProps) {
  const { tokens, totalCount } = await fetchTokens(page);

  const previousPath = page > 1 ? `?page=${page - 1}` : "";
  const nextPath = totalCount > 100 * page ? `?page=${page + 1}` : "";

  return (
    <section className="flex flex-col">
      <div className="flex gap-x-6 mt-12">
        <TokenDisplayControls />
        <PaginationControls previousPath={previousPath} nextPath={nextPath} />
      </div>

      <div className="flex flex-wrap justify-between w-full mt-12">
        {tokens.map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </div>
    </section>
  );
}