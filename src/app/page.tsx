import LaunchCoinButton from "@/components/LaunchCoinButton";
import KingOfTheHill from "@/components/KingOfTheHill";
import TokenDisplayContainer from "@/components/TokenDisplayContainer";
import TokenSearch from "@/components/TokenSearch";

type HomePageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: HomePageProps) {
  const page = searchParams.page || 1;

  return (
    <main className="flex flex-col px-12">
   
      <LaunchCoinButton />

      <KingOfTheHill />

      <TokenSearch />

      <TokenDisplayContainer page={+page}/>

    </main>
  );
}