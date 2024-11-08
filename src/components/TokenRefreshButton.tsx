import useTokens from "@/hooks/useTokens";
import { TokenFilter } from "@/models/token";
import { MdRefresh } from "react-icons/md";
import { useState } from "react";
import { memepoolsApi } from "@/config/env";

type TokenRefreshButtonProps = {
  tokenFilter: TokenFilter;
  tokenPage: number;
  reverse: boolean;
  isNsfw: boolean;
};

export default function TokenRefreshButton({ tokenFilter, tokenPage, reverse, isNsfw }: TokenRefreshButtonProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const { refetch } = useTokens({
    filter: tokenFilter,
    page: tokenPage,
    reverse,
    isNsfw,
  });

  const handleClick = async () => {
    setIsSpinning(true);
    await fetch(`${memepoolsApi}/tasks/refresh-${tokenFilter === TokenFilter.New ? "newest" : tokenFilter}`, {
      method: "POST",
    });
    refetch();
    setTimeout(() => setIsSpinning(false), 550);
  };

  return (
    <button
      className="px-3 h-8 bg-dark-gray border border-gray rounded-[4px] flex items-center justify-center hover:bg-gray transition"
      onClick={handleClick}
    >
      <MdRefresh size={16} className={`transition-transform duration-500 ${isSpinning ? "animate-spin" : ""}`} />
    </button>
  );
}
