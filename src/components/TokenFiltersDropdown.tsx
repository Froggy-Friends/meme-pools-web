"use client";
import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FaChevronDown } from "react-icons/fa6";
import { TokenFilter } from "@/models/token";
import { validTokenFilter } from "@/config/eth/token";

type TokenFiltersDropdownProps = {
  selectedFilter: TokenFilter;
  onFilterChange: (filter: TokenFilter) => void;
};

export default function TokenFiltersDropdown({
  selectedFilter,
  onFilterChange,
}: TokenFiltersDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatFilter = (filter: TokenFilter) =>
    filter.charAt(0).toUpperCase() + filter.slice(1);

  const formattedFilter = formatFilter(selectedFilter);

  return (
    <Dropdown onOpenChange={setIsOpen} className="bg-dark-gray">
      <DropdownTrigger>
        <button className="px-3 h-8 bg-dark-gray border border-gray rounded-[4px] w-[145px] tablet:w-[180px] text-sm relative flex items-center justify-center hover:bg-gray transition">
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
        {validTokenFilter.map((filter) => (
          <DropdownItem key={filter} onClick={() => onFilterChange(filter)}>
            {formatFilter(filter)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
