import LaunchCoinButton from "@/components/LaunchCoinButton";
import KingOfTheHill from "@/components/KingOfTheHill";
import TokenDisplayContainer from "@/components/TokenDisplayContainer";
import TokenSearch from "@/components/TokenSearch";
import { SearchParams } from "@/lib/types";

type SortedTokenPageProps = {
  searchParams: SearchParams;
  params: {
    tokenFilter: string;
  }
};

export default function SortedTokenPage({ searchParams, params }: SortedTokenPageProps) {
  const cursor = searchParams.cursor ?? 0;
  const page = searchParams.page || 1;
  const tokenFilter = params.tokenFilter

  return (
    <main className="flex flex-col px-12">
      <LaunchCoinButton />

      <KingOfTheHill />

      <TokenSearch />

      <TokenDisplayContainer cursor={+cursor} page={+page} tokenFilter={tokenFilter}/>
    </main>
  );
}