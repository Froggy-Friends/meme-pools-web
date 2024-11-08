"use client";

import { Chain } from "@/models/chain";
import { TokenFilter } from "@/models/token";
import { useState } from "react";
import TokenDisplayContainer from "./TokenDisplayContainer";
import TokenFiltersDropdown from "./TokenFiltersDropdown";
import TokenRefreshButton from "./TokenRefreshButton";
import PaginationControls from "./tokens/PaginationControls";
import TokenReverseButton from "./TokenReverseButton";
import { cn } from "@nextui-org/react";
import { Switch } from "@nextui-org/react";

export default function TokenPageContent() {
  const [filter, setFilter] = useState<TokenFilter>(TokenFilter.New);
  const [page, setPage] = useState(1);
  const [reverse, setReverse] = useState(false);
  const [isNsfw, setIsNsfw] = useState(true);

  return (
    <>
      <div className="w-full flex items-center justify-start">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-2 tablet:gap-x-4">
            <TokenFiltersDropdown selectedFilter={filter} onFilterChange={setFilter} />
            <TokenRefreshButton tokenFilter={filter} tokenPage={page} reverse={reverse} />
            <TokenReverseButton reverse={reverse} toggleReverse={() => setReverse(!reverse)} />
          </div>
          <Switch
            isSelected={isNsfw}
            onValueChange={setIsNsfw}
            color="primary"
            size="sm"
            classNames={{
              thumb: "bg-dark",
              base: cn("inline-flex flex-row-reverse", "justify-between cursor-pointer gap-2"),
              wrapper: "hover:bg-light-gray",
            }}
          >
            <p className="text-lg">NSFW</p>
          </Switch>
        </div>
      </div>
      <TokenDisplayContainer filter={filter} page={page} reverse={reverse} isNsfw={isNsfw} />
      <PaginationControls page={page} onPageChange={setPage} />
    </>
  );
}
