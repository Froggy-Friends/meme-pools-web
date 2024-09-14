"use client";

import { Chain } from "@/models/chain";
import { TokenFilter } from "@/models/token";
import { useState } from "react";
import TokenDisplayContainer from "./TokenDisplayContainer";
import TokenFiltersDropdown from "./TokenFiltersDropdown";
import TokenSearch from "./TokenSearch";
import TokenRefreshButton from "./TokenRefreshButton";
import PaginationControls from "./tokens/PaginationControls";
import TokenReverseButton from "./TokenReverseButton";

type TokenPageContentProps = {
  chain: Chain;
};

export default function TokenPageContent({ chain }: TokenPageContentProps) {
  const [filter, setFilter] = useState<TokenFilter>(TokenFilter.New);
  const [page, setPage] = useState(1);
  const [reverse, setReverse] = useState(false);

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <TokenSearch />
        <div className="flex items-center gap-x-4">
          <TokenFiltersDropdown
            selectedFilter={filter}
            onFilterChange={setFilter}
          />
          <TokenRefreshButton
            tokenFilter={filter}
            tokenPage={page}
            reverse={reverse}
          />
          <TokenReverseButton
            reverse={reverse}
            toggleReverse={() => setReverse(!reverse)}
          />
        </div>
      </div>
      <TokenDisplayContainer filter={filter} page={page} reverse={reverse} />
      <PaginationControls page={page} onPageChange={setPage} />
    </>
  );
}
