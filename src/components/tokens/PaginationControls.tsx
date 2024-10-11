"use client";

import useTokenCount from "@/hooks/useTokenCount";
import { Pagination } from "@nextui-org/react";

type PaginationControlsProps = {
  page: number;
  onPageChange: (page: number) => void;
};

export default function PaginationControls({ page, onPageChange }: PaginationControlsProps) {
  const { tokenCount } = useTokenCount();
  let totalPages = 0;
  if (tokenCount) {
    totalPages = Math.ceil(tokenCount / 100);
  }

  return (
    <Pagination
      total={totalPages}
      initialPage={1}
      showControls={true}
      color="primary"
      classNames={{
        cursor: "bg-green text-black",
      }}
      page={page}
      className="flex justify-center mt-10 mb-12 laptop:mb-24"
      onChange={onPageChange}
    />
  );
}
