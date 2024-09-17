import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Chain } from "@/models/chain";

export default function SolanaHomePage() {
  return (
    <main className="flex flex-col min-h-[100vh] mx-32 px-4">
      <Header chain={Chain.Solana} />

      <section className="flex justify-center py-32">
        <h2 className="text-5xl font-bold">
          COMMING <span className="text-green">SOON</span> TO <span className="text-purple">SOLANA</span>
        </h2>
      </section>

      <Footer />
    </main>
  );
}
