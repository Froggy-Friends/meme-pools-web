"use client";
import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { FaChevronDown } from "react-icons/fa6";
import { TokenFilter } from "@/models/token";

type TokenFiltersDropdownProps = {
  selectedFilter: TokenFilter;
  onFilterChange: (filter: TokenFilter) => void;
};

export default function TokenFiltersDropdown({
  selectedFilter,
  onFilterChange,
}: TokenFiltersDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formattedFilter =
    selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1);

  return (
    <Dropdown onOpenChange={setIsOpen} className="bg-dark-gray">
      <DropdownTrigger>
        <button className="px-3 h-8 bg-dark-gray border border-gray rounded-[4px] w-[180px] text-sm relative flex items-center justify-center">
          {formattedFilter}
          <FaChevronDown
            size={10}
            className={`absolute right-3 ${isOpen ? "rotate-180 mt-0.5" : ""}`}
          />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Token filters"
        itemClasses={{
          base: "bg-dark-gray",
        }}
        onAction={(newFilter) => onFilterChange(newFilter as TokenFilter)}
      >
        <DropdownItem key="new">New</DropdownItem>
        <DropdownItem key="trending">Trending</DropdownItem>
        <DropdownItem key="volume">Volume</DropdownItem>
        <DropdownItem key="transactions">Transactions</DropdownItem>
        <DropdownItem key="comments">Comments</DropdownItem>
        <DropdownItem key="votes">Votes</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
