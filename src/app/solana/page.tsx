import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Chains } from "@/models/chains";


export default function SolanaHomePage() {
  return (
    <main className="flex flex-col px-12">
      <Header chain={Chains.Solana}/>

      <Footer />
    </main>
  );
}