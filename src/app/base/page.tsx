import LaunchCoinButton from "@/components/LaunchCoinButton";
import KingOfTheHill from "@/components/KingOfTheHill";
import TokenDisplayContainer from "@/components/TokenDisplayContainer";
import TokenSearch from "@/components/TokenSearch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Chain } from "@/models/chain";

export default function BaseHomePage() {
  return (
    <main className="flex flex-col px-12">
      <Header chain={Chain.Base} />

      <LaunchCoinButton chain={Chain.Base}/>

      <TokenDisplayContainer chain={Chain.Base} />

      <Footer />
    </main>
  );
}
