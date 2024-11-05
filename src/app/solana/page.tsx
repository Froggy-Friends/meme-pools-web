import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Chain } from "@/models/chain";

export default function SolanaHomePage() {
  return (
    <main className="flex flex-col min-h-[100vh] max-w-[410px] tablet:max-w-[750px] laptop:max-w-[924px] desktop:max-w-[1200px] mx-auto px-2 tablet:px-4">
      <Header chain={Chain.Solana} />

      <section className="flex justify-center py-32">
        <h2 className="text-5xl font-bold">
          COMING <span className="text-primary">SOON</span> TO <span className="text-solana">SOLANA</span>
        </h2>
      </section>

      <Footer />
    </main>
  );
}
