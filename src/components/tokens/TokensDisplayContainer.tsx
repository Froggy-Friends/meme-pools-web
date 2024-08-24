import TokenDisplayCard from "@/components/TokenDisplayCard";
import PaginationControls from "./PaginationControls";
import { fetchTokenCount, fetchTokens } from "@/queries/token/queries";
import BackButton from "../BackButton";
import { toTitleCase } from "@/lib/toTitleCase";

type TokesnDisplayContainerProps = {
  filter: string;
  pageFilter: number;
};

export default async function TokensDisplayContainer({
  filter,
  pageFilter,
}: TokesnDisplayContainerProps) {
  const tokenCount = await fetchTokenCount();
  const tokens = await fetchTokens(filter, pageFilter);

  return (
    <section className="flex flex-col mt-20">
      <BackButton />

      <h2 className="text-4xl font-proximaSoftBold mb-10">
        Top {toTitleCase(filter)} Tokens
      </h2>

      <div className="flex flex-wrap w-[1200px]">
        {tokens &&
          tokens.map((token) => {
            return (
              <TokenDisplayCard
                key={token.id}
                token={token}
                className="mb-6 hover:scale-[1.02] trasnsition ease-in-out duration-400"
              />
            );
          })}
      </div>

      <PaginationControls
        tokenCount={tokenCount}
        filter={filter}
        pageFilter={pageFilter}
      />
    </section>
  );
}
