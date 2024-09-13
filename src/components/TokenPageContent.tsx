"use client";

import { Chain } from "@/models/chain";
import { TokenFilter } from "@/models/token";
import { useState } from "react";
import TokenDisplayContainer from "./TokenDisplayContainer";
import TokenFiltersDropdown from "./TokenFiltersDropdown";
import TokenSearch from "./TokenSearch";
import TokenRefreshButton from "./TokenRefreshButton";

type TokenPageContentProps = {
  chain: Chain;
};

export default function TokenPageContent({ chain }: TokenPageContentProps) {
  const [filter, setFilter] = useState<TokenFilter>(TokenFilter.New);
  const [page, setPage] = useState(1);

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <TokenSearch />
        <div className="flex items-center gap-x-4">
          <TokenFiltersDropdown
            selectedFilter={filter}
            onFilterChange={setFilter}
          />
          <TokenRefreshButton tokenFilter={filter} tokenPage={page} />
        </div>
      </div>
      <TokenDisplayContainer
        chain={chain}
        filter={filter}
        page={page}
        onPageChange={setPage}
      />
    </>
  );
}
