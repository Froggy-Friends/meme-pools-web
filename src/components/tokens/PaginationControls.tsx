"use client";

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { cn, PaginationItemType, usePagination } from "@nextui-org/react";
import { tokensPerPage } from "@/config/token";
import { useRouter } from "next/navigation";
import { useChain } from "@/context/chain";

type PaginationControlsProps = {
  tokenCount: number;
  filter: string;
  pageFilter: number;
};

export default function PaginationControls({
  tokenCount,
  filter,
  pageFilter,
}: PaginationControlsProps) {
  const router = useRouter();
  const { chain } = useChain();
  const totalPages = Math.round(tokenCount / tokensPerPage) || 1;
  const { activePage, range, setPage } = usePagination({
    total: totalPages,
    showControls: true,
  });

  const getPreviousPath = () => {
    return pageFilter > 1
      ? `/${chain}/tokens/${filter}?page=${pageFilter - 1}`
      : "";
  };

  const getNextPath = () => {
    return tokenCount > 100 * pageFilter
      ? `/${chain}/tokens/${filter}?page=${pageFilter + 1}`
      : "";
  };

  const previousPath = getPreviousPath();
  const nextPath = getNextPath();

  return (
    <section className="flex flex-col items-center my-10">
      <ul className="flex gap-2 items-center bg-black w-fit h-10 rounded-lg font-proximaSoftBold">
        {range.map((page) => {
          if (page === PaginationItemType.NEXT) {
            return (
              <li key={page} aria-label="next page" className="w-6 h-full mx-2">
                <button
                  className="w-full h-full rounded-full"
                  onClick={() => {
                    router.push(nextPath);
                    setPage(activePage + 1);
                  }}
                  disabled={activePage > 9 || nextPath === ""}
                >
                  <MdKeyboardArrowRight size={28} />
                </button>
              </li>
            );
          }

          if (page === PaginationItemType.PREV) {
            return (
              <li
                key={page}
                aria-label="previous page"
                className="w-6 h-full mx-2"
              >
                <button
                  className="w-full h-full rounded-full"
                  onClick={() => {
                    router.push(previousPath);
                    setPage(activePage - 1);
                  }}
                  disabled={totalPages < 2}
                >
                  <MdKeyboardArrowLeft size={28} />
                </button>
              </li>
            );
          }

          if (page === PaginationItemType.DOTS) {
            return (
              <li key={page} className="w-4 h-4">
                ...
              </li>
            );
          }

          return (
            <li
              key={page}
              aria-label={`page ${page}`}
              className="w-8 h-full hover:bg-dark"
            >
              <button
                className={cn(
                  "w-full h-full rounded-md",
                  activePage === page && "bg-green text-dark hover:bg-green"
                )}
                onClick={() => {
                  router.push(`/${chain}/tokens/${filter}?page=${page}`);
                  setPage(page);
                }}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
