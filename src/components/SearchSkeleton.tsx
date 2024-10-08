type SearchSkeletonParams = {
  caSearch: boolean;
};

export default function SearchSkeleton({ caSearch }: SearchSkeletonParams) {
  return (
    <>
      {caSearch && (
        <div className="space-y-2 mb-2">
          <div className="w-[96%] h-10 mx-auto rounded-lg bg-dark-gray animate-pulseStrong" />
        </div>
      )}

      {!caSearch && (
        <div className="space-y-2 mb-2">
          <div className="w-[96%] h-10 mx-auto rounded-lg bg-dark-gray animate-pulseStrong" />
          <div className="w-[96%] h-10 mx-auto rounded-lg bg-dark-gray animate-pulseStrong" />
          <div className="w-[96%] h-10 mx-auto rounded-lg bg-dark-gray animate-pulseStrong" />
          <div className="w-[96%] h-10 mx-auto rounded-lg bg-dark-gray animate-pulseStrong" />
          <div className="w-[96%] h-10 mx-auto rounded-lg bg-dark-gray animate-pulseStrong" />
          <div className="w-[96%] h-10 mx-auto rounded-lg bg-dark-gray animate-pulseStrong" />
        </div>
      )}
    </>
  );
}
