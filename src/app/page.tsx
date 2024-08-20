import LaunchCoinButton from "@/components/LaunchCoinButton";
import KingOfTheHill from "@/components/KingOfTheHill";
import TokenDisplayContainer from "@/components/TokenDisplayContainer";
import TokenSearch from "@/components/TokenSearch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col px-12">
      <Header />

      <LaunchCoinButton />

      <KingOfTheHill />

      <TokenSearch />

      <TokenDisplayContainer />

      <Footer />
    </main>
  );
}
