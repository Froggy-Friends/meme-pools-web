import LaunchCoinButton from "@/components/LaunchCoinButton";
import KingOfTheHill from "@/components/KingOfTheHill";
import TokenDisplayContainer from "@/components/TokenDisplayContainer";
import TokenSearch from "@/components/TokenSearch";
import { SearchParams } from "@/lib/types";

type HomePageProps = {
  searchParams: SearchParams;
};

export default function Home({ searchParams }: HomePageProps) {
  const cursor = searchParams.cursor ?? 0;
  const page = searchParams.page || 1;

  return (
    <main className="flex flex-col px-12">
      <LaunchCoinButton />

      <KingOfTheHill />

      <TokenSearch />

      <TokenDisplayContainer cursor={+cursor} page={+page} />
    </main>
  );
}
