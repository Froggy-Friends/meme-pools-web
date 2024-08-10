import LaunchCoinButton from "@/components/LaunchCoinButton";
import KingOfTheHill from "@/components/KingOfTheHill";
import TokenDisplayContainer from "@/components/TokenDisplayContainer";
import TokenSearch from "@/components/TokenSearch";
import { SearchParams } from "@/lib/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import fetchTokens, { TokenFilter } from "@/lib/fetchTokens";

type HomePageProps = {
  searchParams: {
    page: number;
    filterBy: TokenFilter;
    cursor: number;
  };
};

export default async function Home({ searchParams }: HomePageProps) {
  const cursor = searchParams.cursor ?? 0;
  const page = searchParams.page ? +searchParams.page : 1;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tokens", searchParams.filterBy, 1],
    queryFn: () => fetchTokens(searchParams.filterBy, page),
  });

  return (
    <main className="flex flex-col px-12">
      <LaunchCoinButton />

      <KingOfTheHill />

      <TokenSearch />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <TokenDisplayContainer />
      </HydrationBoundary>
    </main>
  );
}
