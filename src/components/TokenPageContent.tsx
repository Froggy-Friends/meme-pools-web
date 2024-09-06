"use client";

import { Chain } from "@/models/chain";
import { TokenFilter } from "@/models/token";
import { useState } from "react";
import TokenDisplayContainer from "./TokenDisplayContainer";
import TokenFiltersDropdown from "./TokenFiltersDropdown";
import TokenSearch from "./TokenSearch";

type TokenPageContentProps = {
  chain: Chain;
};

export default function TokenPageContent({ chain }: TokenPageContentProps) {
  const [filter, setFilter] = useState<TokenFilter>(TokenFilter.New);

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <TokenSearch />
        <TokenFiltersDropdown
          selectedFilter={filter}
          onFilterChange={setFilter}
        />
      </div>
      <TokenDisplayContainer chain={chain} filter={filter} page={1} />
    </>
  );
}
