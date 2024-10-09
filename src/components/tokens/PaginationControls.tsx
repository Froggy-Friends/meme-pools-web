"use client";

import { Pagination } from "@nextui-org/react";

type PaginationControlsProps = {
  page: number;
  onPageChange: (page: number) => void;
};

export default function PaginationControls({ page, onPageChange }: PaginationControlsProps) {
  return (
    <Pagination
      total={10}
      initialPage={1}
      showControls={true}
      color="primary"
      classNames={{
        cursor: "bg-green text-black",
      }}
      page={page}
      className="flex justify-center mt-2 mb-12 laptop:mb-24"
      onChange={onPageChange}
    />
  );
}
