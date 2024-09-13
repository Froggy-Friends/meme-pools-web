import useTokens from "@/hooks/useTokens";
import { TokenFilter } from "@/models/token";
import { MdRefresh } from "react-icons/md";

type TokenRefreshButtonProps = {
  tokenFilter: TokenFilter;
  tokenPage: number;
};

export default function TokenRefreshButton({
  tokenFilter,
  tokenPage,
}: TokenRefreshButtonProps) {
  const { refetch } = useTokens(tokenFilter, tokenPage);

  return (
    <button
      className="px-3 h-8 bg-dark-gray border border-gray rounded-[4px] flex items-center justify-center"
      onClick={() => refetch()}
    >
      <MdRefresh size={16} />
    </button>
  );
}
