"use client";

import { useTokens } from "@/hooks/useTokens";
import { TokenFilter } from "@/lib/fetchTokens";
import { useState } from "react";
import TokenDisplayCard from "./TokenDisplayCard";
import TokenDisplayControls from "./TokenDisplayControls";
import PaginationControls from "./PaginationControls";
import useQueryParamState from "@/hooks/useQueryParamState";

export default function TokenDisplayContainer() {
  const [filter, setFilter] = useQueryParamState<TokenFilter>(
    "filterBy",
    "new"
  );
  const [page, setPage] = useQueryParamState<number>("page", 1);
  const { tokens, isLoadingTokens } = useTokens(filter, page);
  if (isLoadingTokens) return <div>Loading...</div>;

  return (
    <section className="flex flex-col">
      <div className="flex gap-x-6 mt-12">
        <TokenDisplayControls filter={filter} onFilterChange={setFilter} />
        <PaginationControls
          back={() => setPage(page - 1)}
          next={() => setPage(page + 1)}
          page={page}
        />
      </div>

      <div className="flex flex-wrap justify-between w-full mt-12">
        {tokens?.map((token) => {
          return <TokenDisplayCard key={token.id} token={token} />;
        })}
      </div>
    </section>
  );
}
