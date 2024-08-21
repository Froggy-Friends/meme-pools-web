import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Chain } from "@/models/chain";


export default function SolanaHomePage() {
  return (
    <main className="flex flex-col px-12">
      <Header chain={Chain.Solana}/>

      <Footer />
    </main>
  );
}