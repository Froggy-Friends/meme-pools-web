import CreateCoinButton from "@/components/CreateCoinButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import KingOfTheHill from "@/components/KingOfTheHill";
import TokenDisplayContainer from "@/components/TokenDisplayContainer";
import TokenDisplayControls from "@/components/TokenDisplayControls";
import TokenSearch from "@/components/TokenSearch";

export default function Home() {
  return (
    <main className="flex flex-col px-12">
      <Header />

      <CreateCoinButton />

      <KingOfTheHill />

      <TokenSearch />

      <TokenDisplayControls />

      <TokenDisplayContainer />

      <Footer />
    </main>
  );
}
