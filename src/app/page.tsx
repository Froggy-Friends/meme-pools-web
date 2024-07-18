import LaunchCoinButton from "@/components/LaunchCoinButton";
import KingOfTheHill from "@/components/KingOfTheHill";
import TokenDisplayContainer from "@/components/TokenDisplayContainer";
import TokenDisplayControls from "@/components/TokenDisplayControls";
import TokenSearch from "@/components/TokenSearch";

export default function Home() {
  return (
    <main className="flex flex-col px-12">
   

      <LaunchCoinButton />

      <KingOfTheHill />

      <TokenSearch />

      <TokenDisplayControls />

      <TokenDisplayContainer />

    </main>
  );
}
