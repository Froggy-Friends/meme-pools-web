import { Skeleton } from "@nextui-org/react";

type SearchSkeletonParams = {
  caSearch: boolean;
};

export default function SearchSkeleton({ caSearch }: SearchSkeletonParams) {
  return (
    <>
      {caSearch && (
        <div className="space-y-3 mb-2">
          <Skeleton className="w-[96%] mx-auto rounded-xl bg-dark-gray">
            <div className="h-10 rounded-xl w-full"></div>
          </Skeleton>
        </div>
      )}

      {!caSearch && (
        <div className="space-y-3 mb-2">
          <Skeleton className="w-[96%] mx-auto rounded-xl bg-dark-gray">
            <div className="h-10 rounded-xl w-full"></div>
          </Skeleton>
          <Skeleton className="w-[96%] mx-auto rounded-xl bg-dark-gray">
            <div className="h-10 rounded-xl w-full"></div>
          </Skeleton>
          <Skeleton className="w-[96%] mx-auto rounded-xl bg-dark-gray">
            <div className="h-10 w-full"></div>
          </Skeleton>
          <Skeleton className="w-[96%] mx-auto rounded-xl bg-dark-gray">
            <div className="h-10 w-full"></div>
          </Skeleton>
          <Skeleton className="w-[96%] mx-auto rounded-xl bg-dark-gray">
            <div className="h-10 w-full"></div>
          </Skeleton>
          <Skeleton className="w-[96%] mx-auto rounded-xl bg-dark-gray">
            <div className="h-10 w-full"></div>
          </Skeleton>
        </div>
      )}
    </>
  );
}
