import { Skeleton } from "@nextui-org/react";

export default function SearchSkeleton() {
  return (
    <div className="space-y-3 mb-2">
      <Skeleton className="w-full rounded-2xl bg-dark-gray">
        <div className="h-10 rounded-xl w-full"></div>
      </Skeleton>
      <Skeleton className="w-full rounded-2xl bg-dark-gray">
        <div className="h-10 rounded-xl w-full"></div>
      </Skeleton>
      <Skeleton className="w-full rounded-2xl bg-dark-gray">
        <div className="h-10 w-full"></div>
      </Skeleton>
      <Skeleton className="w-full rounded-2xl bg-dark-gray">
        <div className="h-10 w-full"></div>
      </Skeleton>
      <Skeleton className="w-full rounded-2xl bg-dark-gray">
        <div className="h-10 w-full"></div>
      </Skeleton>
      <Skeleton className="w-full rounded-2xl bg-dark-gray">
        <div className="h-10 w-full"></div>
      </Skeleton>
    </div>
  );
}
