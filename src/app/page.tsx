import LaunchCoinButton from "@/components/LaunchCoinButton";
import KingOfTheHill from "@/components/KingOfTheHill";
import TokenDisplayContainer from "@/components/TokenDisplayContainer";
import TokenSearch from "@/components/TokenSearch";
import { SearchParams } from "@/lib/types";

type HomePageProps = {
  searchParams: SearchParams;
};

export default function Home({ searchParams }: HomePageProps) {
  const page = searchParams.page || 1;
  const tokenFilter = "new"

  return (
    <main className="flex flex-col px-12">
      <LaunchCoinButton />

      <KingOfTheHill />

      <TokenSearch />

      <TokenDisplayContainer page={+page} tokenFilter={tokenFilter}/>
    </main>
  );
}
